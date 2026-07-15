from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token as django_get_token
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

from .models import Project, Skill, Profile, MissionLog, Certification, ProjectCategory, ContactMessage
from .serializers import ProjectSerializer, SkillSerializer, ProfileSerializer, MissionLogSerializer, CertificationSerializer, ProjectCategorySerializer

logger = logging.getLogger(__name__)

COOKIE_KWARGS = lambda path='/': {
    'httponly': True,
    'secure': settings.SIMPLE_JWT_COOKIE_SECURE,
    'samesite': 'None' if settings.SIMPLE_JWT_COOKIE_SECURE else 'Lax',
    'path': path,
}

@method_decorator(ensure_csrf_cookie, name='get')
class CSRFTokenView(APIView):
    """GET this once on frontend load so Django sets the csrftoken cookie the frontend can read."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "detail": "CSRF cookie set",
            "csrfToken": django_get_token(request),
            "diagnostics": {
                "ALLOWED_HOSTS": settings.ALLOWED_HOSTS,
                "CORS_ALLOWED_ORIGINS": settings.CORS_ALLOWED_ORIGINS,
                "CSRF_TRUSTED_ORIGINS": settings.CSRF_TRUSTED_ORIGINS,
                "DEBUG": settings.DEBUG,
            }
        })


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
            except Exception as e:
                logger.warning(f"Could not blacklist refresh token: {str(e)}")

        # Clear cookies using exact settings to ensure browser removes them
        access_kwargs = COOKIE_KWARGS('/')
        refresh_kwargs = COOKIE_KWARGS('/api/auth/')

        response.set_cookie(
            settings.SIMPLE_JWT_ACCESS_COOKIE,
            '',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            **access_kwargs
        )
        response.set_cookie(
            settings.SIMPLE_JWT_REFRESH_COOKIE,
            '',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            **refresh_kwargs
        )
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


import urllib.request
import json
import os

def send_via_resend(api_key, from_email, to_email, subject, html_content, text_content):
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Resend requires sending from verified domain or onboarding@resend.dev
    sender = from_email
    if not sender or "gmail.com" in sender.lower() or "example.com" in sender.lower() or "onboarding" in api_key.lower() or sender == "owner@example.com":
        sender = "onboarding@resend.dev"

    payload = {
        "from": sender,
        "to": [to_email],
        "subject": subject,
        "html": html_content,
        "text": text_content
    }

    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            logger.info(f"Resend email sent successfully to {to_email}. Response: {res_body}")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        logger.error(f"Resend API HTTPError ({e.code}): {err_body}")
        raise e
    except Exception as e:
        logger.error(f"Resend API error: {str(e)}")
        raise e


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

        # 3.5 Save contact message to database
        try:
            ContactMessage.objects.create(name=name, email=email, message=message)
        except Exception as e:
            logger.error(f"Failed to save contact message to database: {str(e)}", exc_info=True)

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
            # Prepare Email 1 (Owner)
            msg1 = EmailMultiAlternatives(owner_subject, owner_text, default_from_email, [owner_email])
            msg1.attach_alternative(owner_html, "text/html")

            # Prepare Email 2 (Sender)
            msg2 = EmailMultiAlternatives(sender_subject, sender_text, default_from_email, [email])
            msg2.attach_alternative(sender_html, "text/html")

            # Send emails asynchronously in a background thread to prevent UI blocking
            import threading
            def send_async():
                try:
                    resend_api_key = getattr(settings, 'RESEND_API_KEY', None) or os.getenv('RESEND_API_KEY')
                    if resend_api_key:
                        logger.info("Resend API Key found. Dispatching emails via Resend HTTP API...")
                        # Send Email 1 (Owner)
                        send_via_resend(resend_api_key, default_from_email, owner_email, owner_subject, owner_html, owner_text)
                        # Send Email 2 (Sender)
                        send_via_resend(resend_api_key, default_from_email, email, sender_subject, sender_html, sender_text)
                    else:
                        logger.info("Resend API Key not found. Falling back to Django SMTP mail backend...")
                        from django.core import mail
                        # Use a single SMTP connection for both emails to avoid multiple handshakes
                        connection = mail.get_connection()
                        connection.open()
                        connection.send_messages([msg1, msg2])
                        connection.close()
                        logger.info(f"Emails dispatched successfully in background thread: owner={owner_email}, sender={email}")
                except Exception as async_exc:
                    logger.error(f"Failed to send email notifications in background thread: {str(async_exc)}", exc_info=True)

            thread = threading.Thread(target=send_async)
            thread.start()

            return Response({"detail": "Message sent — check your email for confirmation"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Failed to initiate email sending flow: {str(e)}", exc_info=True)
            # Since the message is already saved in the database, return 200 OK
            return Response(
                {"detail": "Message received successfully — (notification dispatch pending)"}, 
                status=status.HTTP_200_OK
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


class ProjectCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectCategory.objects.all().order_by('name')
    serializer_class = ProjectCategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


