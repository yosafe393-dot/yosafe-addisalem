from rest_framework import permissions

class IsLegalOfficerOrAdmin(permissions.BasePermission):
    """
    Allows access only to legal officers, legal admins, or system admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['legal_officer', 'admin', 'system_admin']
        )

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to legal directorate head or system admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['admin', 'system_admin']
        )
