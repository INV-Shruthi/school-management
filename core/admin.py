from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Teacher, Student ,Exam, Question, StudentExam, StudentAnswer

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )

admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(StudentExam)
admin.site.register(StudentAnswer)

