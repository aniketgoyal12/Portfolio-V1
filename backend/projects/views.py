from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.throttling import SimpleRateThrottle
import logging

from .models import Project, Skill, Profile, MissionLog, Certification
from .serializers import ProjectSerializer, SkillSerializer, ProfileSerializer, MissionLogSerializer, CertificationSerializer

logger = logging.getLogger(__name__)

COOKIE_KWARGS = lambda path='/': {
    'httponly': True,
    'secure': settings.SIMPLE_JWT_COOKIE_SECURE,
    'samesite': 'Lax',
    'path': path,
}

@method_decorator(ensure_csrf_cookie, name='get')
class CSRFTokenView(APIView):
    """GET this once on frontend load so Django sets the csrftoken cookie the frontend can read."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"detail": "CSRF cookie set"})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = TokenObtainPairSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.user
        refresh = serializer.get_token(user)

        response = Response({
            "detail": "Authentication successful",
            "user": {"username": user.username, "is_staff": user.is_staff}
        }, status=status.HTTP_200_OK)

        response.set_cookie(settings.SIMPLE_JWT_ACCESS_COOKIE, str(refresh.access_token), **COOKIE_KWARGS('/'))
        response.set_cookie(settings.SIMPLE_JWT_REFRESH_COOKIE, str(refresh), **COOKIE_KWARGS('/api/auth/'))
        return response


class RefreshView(APIView):
    """Exchanges a valid refresh cookie for a new access token. Required — access tokens expire every 15 min."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT_REFRESH_COOKIE)
        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({"detail": "Token refreshed"}, status=status.HTTP_200_OK)
        response.set_cookie(settings.SIMPLE_JWT_ACCESS_COOKIE, new_access, **COOKIE_KWARGS('/'))

        if hasattr(refresh, 'access_token') and settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
            response.set_cookie(settings.SIMPLE_JWT_REFRESH_COOKIE, str(refresh), **COOKIE_KWARGS('/api/auth/'))

        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT_REFRESH_COOKIE)
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception:
                pass
        response.delete_cookie(settings.SIMPLE_JWT_ACCESS_COOKIE, path='/')
        response.delete_cookie(settings.SIMPLE_JWT_REFRESH_COOKIE, path='/api/auth/')
        return response


class VerifyAuthView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "detail": "Authenticated",
            "user": {"username": request.user.username, "is_staff": request.user.is_staff}
        }, status=status.HTTP_200_OK)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('id')
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['patch'], url_path='toggle-featured')
    def toggle_featured(self, request, pk=None):
        project = self.get_object()
        project.featured = not project.featured
        project.save()
        return Response({"featured": project.featured}, status=status.HTTP_200_OK)


class ContactRateThrottle(SimpleRateThrottle):
    scope = 'contact'

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class ContactFormView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactRateThrottle]

    def post(self, request, *args, **kwargs):
        name = request.data.get("name", "").strip()
        email = request.data.get("email", "").strip()
        message = request.data.get("message", "").strip()
        website = request.data.get("website", "").strip()

        # 1. Honeypot check
        if website:
            logger.warning("Spam submission blocked via honeypot field.")
            return Response({"detail": "Spam detected"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Required fields validation
        if not name or not email or not message:
            return Response({"detail": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Email validation
        try:
            validate_email(email)
        except ValidationError:
            return Response({"detail": "Invalid email address format"}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Email setup
        profile = Profile.objects.first()
        if profile:
            owner_email = profile.owner_email
            default_from_email = profile.default_from_email
        else:
            owner_email = getattr(settings, 'OWNER_EMAIL', None) or settings.DEFAULT_FROM_EMAIL
            default_from_email = settings.DEFAULT_FROM_EMAIL

        if not owner_email:
            logger.error("OWNER_EMAIL or DEFAULT_FROM_EMAIL settings are not configured.")
            return Response({"detail": "Email service configuration missing"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Email 1: To the Owner
        owner_subject = f"New message from {name} via portfolio"
        owner_context = {
            "sender_name": name,
            "sender_email": email,
            "message": message,
        }
        owner_html = render_to_string("emails/owner_notification.html", owner_context)
        owner_text = f"New message via portfolio:\n\nName: {name}\nEmail: {email}\n\nMessage:\n{message}"

        # Email 2: To the Sender
        sender_subject = "Thanks for reaching out"
        sender_context = {
            "sender_name": name,
            "message": message,
        }
        sender_html = render_to_string("emails/sender_confirmation.html", sender_context)
        sender_text = (
            f"Hi {name},\n\n"
            f"Thanks for reaching out through my portfolio. I've received your message and will get back to you as soon as possible.\n\n"
            f"Your message:\n{message}\n\n"
            f"Talk soon,\nAniket Goyal"
        )

        try:
            # Send Email 1 (Owner)
            msg1 = EmailMultiAlternatives(owner_subject, owner_text, default_from_email, [owner_email])
            msg1.attach_alternative(owner_html, "text/html")
            msg1.send()

            # Send Email 2 (Sender)
            msg2 = EmailMultiAlternatives(sender_subject, sender_text, default_from_email, [email])
            msg2.attach_alternative(sender_html, "text/html")
            msg2.send()

            return Response({"detail": "Message sent — check your email for confirmation"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}", exc_info=True)
            return Response(
                {"detail": "Failed to transmit message due to mail server communication issues"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('category', 'name')
    serializer_class = SkillSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ProfileView(APIView):
    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            return Response({
                "bio_p1": "",
                "bio_p2": "",
                "stack": "MERN",
                "focus": "Full Stack",
                "approach": "System Design",
                "status": "Active",
                "owner_email": "goyalaniket2006@gmail.com",
                "default_from_email": "goyalaniket2006@gmail.com"
            })
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.first()
        if not profile:
            serializer = ProfileSerializer(data=request.data)
        else:
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class MissionLogViewSet(viewsets.ModelViewSet):
    queryset = MissionLog.objects.all().order_by('order', 'created_at')
    serializer_class = MissionLogSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all().order_by('order', 'created_at')
    serializer_class = CertificationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


