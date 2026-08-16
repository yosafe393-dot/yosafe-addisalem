from django.db import models
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
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"


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
    case_id = models.CharField(max_length=50, unique=True, db_index=True)
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

    def __str__(self):
        return f"{self.file_name} ({self.case.case_id})"


class Hearing(models.Model):
    case = models.ForeignKey(LegalCase, on_delete=models.CASCADE, related_name='hearings')
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=150)
    judge_or_chair = models.CharField(max_length=150)
    session_type = models.CharField(max_length=100, default='Court Hearing')
    status = models.CharField(max_length=50, default='Scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.case.case_id} Hearing on {self.date}"


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

    def __str__(self):
        return f"{self.agreement_number} - {self.recipient_name}"


class AuditLog(models.Model):
    user = models.CharField(max_length=150)
    role = models.CharField(max_length=50)
    action = models.CharField(max_length=100)
    module = models.CharField(max_length=100)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.user} - {self.action}"
