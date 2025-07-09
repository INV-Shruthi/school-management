from rest_framework import serializers
from .models import CustomUser, Teacher, Student
from rest_framework.validators import UniqueValidator


# ✅ CustomUser Serializer (for reuse if needed)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']


# ✅ Teacher Serializer with full name
class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            'id',
            'employee_id',
            'subject_specialization',
            'date_of_joining',
            'status',
            'full_name',
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


# ✅ Student Serializer with teacher's full name instead of ID
class StudentSerializer(serializers.ModelSerializer):
    assigned_teacher = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id',
            'roll_number',
            'student_name',
            'phone_number',
            'student_class',
            'date_of_birth',
            'admission_date',
            'status',
            'user',
            'assigned_teacher',
        ]

    def get_assigned_teacher(self, obj):
        if obj.assigned_teacher:
            return f"{obj.assigned_teacher.user.first_name} {obj.assigned_teacher.user.last_name}"
        return None

    def get_student_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


# ✅ Minimal Student Serializer (used in teacher's /students/ view)
class StudentNameSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name')

    class Meta:
        model = Student
        fields = ['id', 'name']