from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LegalCaseViewSet, 
    CaseDocumentViewSet, 
    ScholarshipViewSet, 
    HearingViewSet, 
    AuditLogViewSet, 
    UserViewSet
)

router = DefaultRouter()
router.register(r'cases', LegalCaseViewSet, basename='cases')
router.register(r'documents', CaseDocumentViewSet, basename='documents')
router.register(r'scholarships', ScholarshipViewSet, basename='scholarships')
router.register(r'hearings', HearingViewSet, basename='hearings')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-logs')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]
