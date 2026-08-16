from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from .models import LegalCase, CaseDocument, Hearing, ScholarshipAgreement, AuditLog, CustomUser
from .serializers import (
    LegalCaseSerializer, CaseDocumentSerializer, HearingSerializer,
    ScholarshipAgreementSerializer, AuditLogSerializer, UserSerializer
)
from .permissions import IsLegalOfficerOrAdmin, IsAdminUser

class LegalCaseViewSet(viewsets.ModelViewSet):
    queryset = LegalCase.objects.all().select_related('assigned_officer', 'submitted_by').prefetch_related('documents', 'hearings')
    serializer_class = LegalCaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'campus', 'priority']
    search_fields = ['case_id', 'title', 'plaintiff', 'defendant', 'department', 'summary']
    ordering_fields = ['created_at', 'date_opened', 'priority']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return LegalCase.objects.none()
        if user.role == 'legal_officer':
            return self.queryset.filter(Q(assigned_officer=user) | Q(submitted_by=user))
        elif user.role == 'user':
            return self.queryset.filter(submitted_by=user)
        # Admin and System Admin view all
        return self.queryset

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total = LegalCase.objects.count()
        active = LegalCase.objects.exclude(status='Closed').count()
        closed = LegalCase.objects.filter(status='Closed').count()
        by_category = LegalCase.objects.values('category').annotate(count=Count('id'))
        
        return Response({
            'total_cases': total,
            'active_cases': active,
            'closed_cases': closed,
            'legal_officers_count': CustomUser.objects.filter(role='legal_officer').count(),
            'departments_count': 25,
            'by_category': by_category
        })

    @action(detail=True, methods=['post'], permission_classes=[IsLegalOfficerOrAdmin])
    def assign_officer(self, request, pk=None):
        case = self.get_object()
        officer_id = request.data.get('officer_id')
        try:
            officer = CustomUser.objects.get(id=officer_id, role='legal_officer')
            case.assigned_officer = officer
            case.save()
            
            # Log to Audit
            AuditLog.objects.create(
                user=request.user.get_full_name() or request.user.username,
                role=request.user.role,
                action="CASE_ASSIGNMENT",
                module="Case Management",
                details=f"Assigned case {case.case_id} to {officer.get_full_name() or officer.username}"
            )
            return Response({'status': 'assigned', 'officer': officer.get_full_name() or officer.username})
        except CustomUser.DoesNotExist:
            return Response({'error': 'Officer not found'}, status=status.HTTP_404_NOT_FOUND)


class CaseDocumentViewSet(viewsets.ModelViewSet):
    queryset = CaseDocument.objects.all()
    serializer_class = CaseDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['case', 'confidentiality']


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipAgreement.objects.all()
    serializer_class = ScholarshipAgreementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'campus', 'degree_level']
    search_fields = ['agreement_number', 'recipient_name', 'staff_id', 'department', 'host_institution']


class HearingViewSet(viewsets.ModelViewSet):
    queryset = Hearing.objects.all().order_by('date', 'time')
    serializer_class = HearingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['case', 'status', 'date']


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['user', 'action', 'details', 'module']


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'campus', 'department']
