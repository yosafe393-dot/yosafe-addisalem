from rest_framework import serializers
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
