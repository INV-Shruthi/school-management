from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action,api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
import csv , io
from django.http import HttpResponse,JsonResponse
from rest_framework.parsers import MultiPartParser
from .models import Teacher, Student, CustomUser
from .serializers import (
    TeacherSerializer,
    StudentSerializer,
    StudentNameSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsAdminOrReadOnly, IsTeacherOrAdmin, IsSelfStudent
from rest_framework.permissions import IsAuthenticated

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

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
@parser_classes([MultiPartParser])
def import_students_csv(request):
    csv_file = request.FILES.get('file')

    if not csv_file or not csv_file.name.endswith('.csv'):
        return JsonResponse({'error': 'Please upload a valid CSV file.'}, status=400)

    decoded_file = csv_file.read().decode('utf-8')
    io_string = io.StringIO(decoded_file)
    reader = csv.DictReader(io_string)

    created_count = 0
    errors = []

    for idx, row in enumerate(reader, start=1):
        try:
            if CustomUser.objects.filter(username=row['username']).exists():
                errors.append(f"Row {idx}: Username already exists.")
                continue
            if CustomUser.objects.filter(email=row['email']).exists():
                errors.append(f"Row {idx}: Email already exists.")
                continue

            user = CustomUser.objects.create_user(
                username=row['username'],
                email=row['email'],
                password=row['password'],
                first_name=row.get('first_name', ''),
                last_name=row.get('last_name', ''),
                role='student'
            )

            teacher = Teacher.objects.get(id=row['assigned_teacher_id'])

            Student.objects.create(
                user=user,
                roll_number=row['roll_number'],
                phone_number=row['phone_number'],
                student_class=row['student_class'],
                date_of_birth=row['date_of_birth'],
                admission_date=row['admission_date'],
                status=row['status'].lower(),
                assigned_teacher=teacher
            )
            created_count += 1

        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")

    return JsonResponse({
        'message': f'{created_count} students imported successfully.',
        'errors': errors
    })
