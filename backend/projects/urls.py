from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, CSRFTokenView, LoginView, RefreshView, 
    LogoutView, VerifyAuthView, ContactFormView, SkillViewSet, ProfileView,
    MissionLogViewSet, CertificationViewSet, ProjectCategoryViewSet
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'missions', MissionLogViewSet, basename='mission')
router.register(r'certifications', CertificationViewSet, basename='certification')
router.register(r'categories', ProjectCategoryViewSet, basename='category')

urlpatterns = [
    path('auth/csrf/', CSRFTokenView.as_view(), name='csrf_token'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', RefreshView.as_view(), name='refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify/', VerifyAuthView.as_view(), name='verify_auth'),
    path('contact/', ContactFormView.as_view(), name='contact_form'),
    path('profile/', ProfileView.as_view(), name='profile_config'),
    path('', include(router.urls)),
]
