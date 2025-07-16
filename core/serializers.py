from rest_framework import serializers
from .models import CustomUser, Teacher, Student
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'user_id': self.user.id,
            'username': self.user.username,
            'role': self.user.role,
        })
        return data



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }



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



class StudentSerializer(serializers.ModelSerializer):
    assigned_teacher = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(), write_only=True
    )
    assigned_teacher_name = serializers.SerializerMethodField()
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
            'assigned_teacher_name'    
        ]

    def get_assigned_teacher_name(self, obj):
        if obj.assigned_teacher:
            return f"{obj.assigned_teacher.user.first_name} {obj.assigned_teacher.user.last_name}"
        return None

    def get_student_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"



    def get_assigned_teacher(self, obj):
        if obj.assigned_teacher:
            return f"{obj.assigned_teacher.user.first_name} {obj.assigned_teacher.user.last_name}"
        return None

    def get_student_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class StudentNameSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name')

    class Meta:
        model = Student
        fields = ['id', 'name']
