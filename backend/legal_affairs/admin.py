from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, LegalCase, CaseDocument, Hearing, ScholarshipAgreement, AuditLog

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'campus', 'department', 'is_verified']
    list_filter = ['role', 'campus', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('UoG Legal Profile', {'fields': ('role', 'role_title', 'department', 'campus', 'phone_number', 'is_verified')}),
    )

@admin.register(LegalCase)
class LegalCaseAdmin(admin.ModelAdmin):
    list_display = ['case_id', 'title', 'category', 'campus', 'status', 'priority', 'assigned_officer', 'date_opened']
    list_filter = ['status', 'category', 'campus', 'priority']
    search_fields = ['case_id', 'title', 'plaintiff', 'defendant', 'department']

@admin.register(CaseDocument)
class CaseDocumentAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'case', 'confidentiality', 'uploaded_by', 'uploaded_at']
    list_filter = ['confidentiality', 'file_type']

@admin.register(Hearing)
class HearingAdmin(admin.ModelAdmin):
    list_display = ['case', 'date', 'time', 'location', 'judge_or_chair', 'status']
    list_filter = ['status', 'date']

@admin.register(ScholarshipAgreement)
class ScholarshipAgreementAdmin(admin.ModelAdmin):
    list_display = ['agreement_number', 'recipient_name', 'department', 'degree_level', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'campus', 'degree_level']
    search_fields = ['agreement_number', 'recipient_name', 'staff_id']

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'user', 'role', 'action', 'module']
    list_filter = ['role', 'module', 'action']
    search_fields = ['user', 'details']
    readonly_fields = ['timestamp', 'user', 'role', 'action', 'module', 'details', 'ip_address']
