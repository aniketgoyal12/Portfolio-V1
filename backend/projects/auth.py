from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT_ACCESS_COOKIE)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
        except Exception:
            return None

        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            self.enforce_csrf(request)

        return user, validated_token

    def enforce_csrf(self, request):
        def dummy_get_response(request):
            return None
        check = CSRFCheck(dummy_get_response)
        
        raw_request = request._request
        csrf_processing_done = getattr(raw_request, 'csrf_processing_done', False)
        dont_enforce_csrf_checks = getattr(raw_request, '_dont_enforce_csrf_checks', False)
        
        # Disable bypass flags to force Django CSRF validation
        raw_request.csrf_processing_done = False
        raw_request._dont_enforce_csrf_checks = False
        
        try:
            check.process_request(raw_request)
            reason = check.process_view(raw_request, None, (), {})
            if reason:
                raise PermissionDenied(f"CSRF Validation Failed: {reason}")
        finally:
            # Restore bypass flags
            raw_request.csrf_processing_done = csrf_processing_done
            raw_request._dont_enforce_csrf_checks = dont_enforce_csrf_checks
