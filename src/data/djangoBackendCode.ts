export const DJANGO_BACKEND_FILES = [
  {
    fileName: 'backend/legal_affairs/models.py',
    language: 'python',
    description: 'Django ORM Models representing University of Gondar Legal Cases, Officers, Hearings, Documents, and Scholarship Agreements',
    code: `from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Campus(models.TextChoices):
    MAIN_GC = 'GC (Main Campus)', _('GC (Main Campus)')
    TEDROS = 'Tedros', _('Tedros')
    FASILEDES = 'Fasiledes', _('Fasiledes')
    TSEDA = 'Tseda', _('Tseda')
    MARAKI = 'Maraki', _('Maraki')

class Role(models.TextChoices):
    ADMIN = 'admin', _('Legal Affairs Directorate Admin / Head')
    LEGAL_OFFICER = 'legal_officer', _('Legal Officer / Counsel')
    USER = 'user', _('University Staff / Department User')
    SYSTEM_ADMIN = 'system_admin', _('System Administrator')

class CustomUser(AbstractUser):
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    role_title = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=150, blank=True)
    campus = models.CharField(max_length=50, choices=Campus.choices, default=Campus.MAIN_GC)
    phone_number = models.CharField(max_length=30, blank=True)
    is_verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"


class CaseCategory(models.TextChoices):
    CONTRACT = 'Contract Disputes', _('Contract Disputes')
    EMPLOYMENT = 'Employment Matters', _('Employment Matters')
    DISCIPLINARY = 'Disciplinary Cases', _('Disciplinary Cases')
    PROPERTY = 'Property Matters', _('Property Matters')
    COURT = 'Court Cases', _('Court Cases')
    SCHOLARSHIP = 'Scholarship Agreements', _('Scholarship Agreements')
    INSTITUTIONAL = 'Institutional Legal Matters', _('Institutional Legal Matters')
    OTHERS = 'Others', _('Others')

class CaseStatus(models.TextChoices):
    NEWLY_REGISTERED = 'Newly Registered', _('Newly Registered')
    UNDER_REVIEW = 'Under Review', _('Under Review')
    INVESTIGATION = 'Investigation', _('Investigation')
    COURT_PROCEEDING = 'Court Proceeding', _('Court Proceeding')
    IN_PROGRESS = 'In Progress', _('In Progress')
    CLOSED = 'Closed', _('Closed')

class CasePriority(models.TextChoices):
    LOW = 'Low', _('Low')
    MEDIUM = 'Medium', _('Medium')
    HIGH = 'High', _('High')
    URGENT = 'Urgent', _('Urgent')


class LegalCase(models.Model):
    case_id = models.CharField(max_length=50, unique=True, db_index=True) # e.g. UOG/2025/C/045
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=60, choices=CaseCategory.choices)
    campus = models.CharField(max_length=50, choices=Campus.choices)
    department = models.CharField(max_length=150)
    
    plaintiff = models.CharField(max_length=255, help_text="Claimant or Prosecuting Department")
    defendant = models.CharField(max_length=255, help_text="Respondent or Accused Party")
    
    assigned_officer = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_cases',
        limit_choices_to={'role': Role.LEGAL_OFFICER}
    )
    
    status = models.CharField(max_length=30, choices=CaseStatus.choices, default=CaseStatus.NEWLY_REGISTERED)
    priority = models.CharField(max_length=20, choices=CasePriority.choices, default=CasePriority.MEDIUM)
    
    summary = models.TextField()
    legal_basis = models.TextField(blank=True, null=True)
    estimated_financial_impact = models.DecimalField(max_digits=14, decimal_places=2, default=0.0)
    
    submitted_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='submitted_cases')
    date_opened = models.DateField(auto_now_add=True)
    date_closed = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Legal Case"
        verbose_name_plural = "Legal Cases"

    def __str__(self):
        return f"{self.case_id} - {self.title}"


class CaseDocument(models.Model):
    case = models.ForeignKey(LegalCase, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='legal_documents/%Y/%m/')
    file_name = models.CharField(max_length=255)
    file_size = models.CharField(max_length=50)
    file_type = models.CharField(max_length=20)
    confidentiality = models.CharField(max_length=50, default='Confidential')
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Hearing(models.Model):
    case = models.ForeignKey(LegalCase, on_delete=models.CASCADE, related_name='hearings')
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=150) # Court Room 1, Court Room 2, High Court of Gondar
    judge_or_chair = models.CharField(max_length=150)
    session_type = models.CharField(max_length=100, default='Court Hearing')
    status = models.CharField(max_length=50, default='Scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ScholarshipAgreement(models.Model):
    agreement_number = models.CharField(max_length=60, unique=True)
    recipient_name = models.CharField(max_length=200)
    staff_id = models.CharField(max_length=50)
    department = models.CharField(max_length=150)
    campus = models.CharField(max_length=50, choices=Campus.choices)
    degree_level = models.CharField(max_length=30)
    host_institution = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    
    start_date = models.DateField()
    end_date = models.DateField()
    funding_source = models.CharField(max_length=100)
    
    tuition_fee_etb = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    monthly_stipend_etb = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    total_estimated_cost_etb = models.DecimalField(max_digits=14, decimal_places=2, default=0.0)
    
    guarantor_1_name = models.CharField(max_length=200)
    guarantor_1_phone = models.CharField(max_length=50)
    guarantor_2_name = models.CharField(max_length=200, blank=True)
    guarantor_2_phone = models.CharField(max_length=50, blank=True)
    
    service_obligation_years = models.PositiveIntegerField(default=4)
    status = models.CharField(max_length=60, default='Active Study')
    related_case = models.ForeignKey(LegalCase, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)


class AuditLog(models.Model):
    user = models.CharField(max_length=150)
    role = models.CharField(max_length=50)
    action = models.CharField(max_length=100)
    module = models.CharField(max_length=100)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
`
  },
  {
    fileName: 'backend/legal_affairs/serializers.py',
    language: 'python',
    description: 'Django REST Framework Serializers for JSON serialization and validation',
    code: `from rest_framework import serializers
from .models import CustomUser, LegalCase, CaseDocument, Hearing, ScholarshipAgreement, AuditLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'role_title', 'department', 'campus', 'phone_number']

class CaseDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='uploaded_by.get_full_name')

    class Meta:
        model = CaseDocument
        fields = '__all__'

class HearingSerializer(serializers.ModelSerializer):
    case_title = serializers.ReadOnlyField(source='case.title')
    case_number = serializers.ReadOnlyField(source='case.case_id')

    class Meta:
        model = Hearing
        fields = '__all__'

class LegalCaseSerializer(serializers.ModelSerializer):
    assigned_officer_name = serializers.SerializerMethodField()
    documents = CaseDocumentSerializer(many=True, read_only=True)
    hearings = HearingSerializer(many=True, read_only=True)

    class Meta:
        model = LegalCase
        fields = '__all__'

    def get_assigned_officer_name(self, obj):
        if obj.assigned_officer:
            return obj.assigned_officer.get_full_name() or obj.assigned_officer.username
        return None

class ScholarshipAgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipAgreement
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
`
  },
  {
    fileName: 'backend/legal_affairs/views.py',
    language: 'python',
    description: 'DRF ViewSets with Role-Based Permissions (Admin, Legal Officer, User, System Admin)',
    code: `from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import LegalCase, CaseDocument, Hearing, ScholarshipAgreement, AuditLog, CustomUser
from .serializers import (
    LegalCaseSerializer, CaseDocumentSerializer, HearingSerializer,
    ScholarshipAgreementSerializer, AuditLogSerializer, UserSerializer
)

class IsLegalOfficerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['legal_officer', 'admin', 'system_admin']

class LegalCaseViewSet(viewsets.ModelViewSet):
    queryset = LegalCase.objects.all().select_related('assigned_officer', 'submitted_by').prefetch_related('documents', 'hearings')
    serializer_class = LegalCaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'legal_officer':
            return self.queryset.filter(assigned_officer=user)
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
        officer = CustomUser.objects.get(id=officer_id, role='legal_officer')
        case.assigned_officer = officer
        case.save()
        
        # Log to Audit
        AuditLog.objects.create(
            user=request.user.get_full_name(),
            role=request.user.role,
            action="CASE_ASSIGNMENT",
            module="Case Management",
            details=f"Assigned case {case.case_id} to {officer.get_full_name()}"
        )
        return Response({'status': 'assigned', 'officer': officer.get_full_name()})


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipAgreement.objects.all()
    serializer_class = ScholarshipAgreementSerializer
    permission_classes = [permissions.IsAuthenticated]


class HearingViewSet(viewsets.ModelViewSet):
    queryset = Hearing.objects.all().order_by('date', 'time')
    serializer_class = HearingSerializer
    permission_classes = [permissions.IsAuthenticated]
`
  },
  {
    fileName: 'backend/legal_affairs/urls.py',
    language: 'python',
    description: 'Django REST Framework Router and API URL endpoints configuration',
    code: `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LegalCaseViewSet, ScholarshipViewSet, HearingViewSet

router = DefaultRouter()
router.register(r'cases', LegalCaseViewSet, basename='cases')
router.register(r'scholarships', ScholarshipViewSet, basename='scholarships')
router.register(r'hearings', HearingViewSet, basename='hearings')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('dj_rest_auth.urls')),
]
`
  }
];
