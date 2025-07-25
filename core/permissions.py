from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.method in permissions.SAFE_METHODS
        )

class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'teacher' or request.user.is_superuser
        )

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsSelfStudent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.user == request.user

