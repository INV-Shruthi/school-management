from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
import csv
from django.http import HttpResponse
from .models import Teacher, Student, CustomUser
from .serializers import (
    TeacherSerializer,
    StudentSerializer,
    StudentNameSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsAdminOrReadOnly, IsTeacherOrAdmin, IsSelfStudent

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsTeacherOrAdmin]

    @action(detail=True, methods=['get'], permission_classes=[IsTeacherOrAdmin])
    def students(self, request, pk=None):
        teacher = self.get_object()
        students = Student.objects.filter(assigned_teacher=teacher)
        serializer = StudentNameSerializer(students, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Teacher.objects.filter(user=user)
        return Teacher.objects.all()
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def export_teachers_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="teachers.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Employee ID', 'Full Name', 'Subject Specialization', 'Date of Joining'])

        for teacher in Teacher.objects.all():
            full_name = f"{teacher.user.first_name} {teacher.user.last_name}"
            writer.writerow([
                teacher.id,
                teacher.employee_id,
                full_name,
                teacher.subject_specialization,
                teacher.date_of_joining
            ])
        return response



class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()  
    serializer_class = StudentSerializer
    permission_classes = [IsTeacherOrAdmin | IsSelfStudent]
    
 

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            teacher = get_object_or_404(Teacher, user=user)
            return Student.objects.filter(assigned_teacher=teacher)
        elif user.role == 'student':
            return Student.objects.filter(user=user)
        return Student.objects.all()
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def export_students_csv(self, request):
        user = request.user
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="students.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Roll Number', 'Student Name', 'Phone', 'Class', 'DOB', 'Admission Date', 'Assigned Teacher'])

        if user.is_superuser:
            students = Student.objects.all()
        elif user.role == 'teacher':
            teacher = get_object_or_404(Teacher, user=user)
            students = Student.objects.filter(assigned_teacher=teacher)
        else:
            return Response({'detail': 'Not authorized to export student data.'}, status=403)

        for student in students:
            student_name = f"{student.user.first_name} {student.user.last_name}"
            teacher_name = (
                f"{student.assigned_teacher.user.first_name} {student.assigned_teacher.user.last_name}"
                if student.assigned_teacher else "N/A"
            )
            writer.writerow([
                student.id,
                student.roll_number,
                student_name,
                student.phone_number,
                student.student_class,
                student.date_of_birth,
                student.admission_date,
                teacher_name
            ])
        return response
        

class RegisterUserView(APIView):
    def post(self, request):
        data = request.data.copy()
        data['password'] = make_password(data['password'])
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  

    def get_queryset(self):
        return CustomUser.objects.all()


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
