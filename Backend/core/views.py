from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action,api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
import csv , io
from django.core.mail import send_mail
from core.permissions import IsTeacherOrAdmin, IsSelfStudent
from django.http import HttpResponse,JsonResponse
from rest_framework.parsers import MultiPartParser
from .models import Teacher, Student, CustomUser ,Exam, StudentExam
from .serializers import (
    TeacherSerializer,
    StudentSerializer,
    StudentNameSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    ExamSerializer,
    StudentExamSerializer
)
from .permissions import IsAdminOrReadOnly, IsTeacherOrAdmin, IsSelfStudent
from rest_framework.permissions import IsAuthenticated
from itsdangerous import URLSafeTimedSerializer
from django.conf import settings

serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

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
    # permission_classes = [IsTeacherOrAdmin | IsSelfStudent]
    permission_classes = [IsAuthenticated]

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

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser:
            return Exam.objects.all()  

        elif user.role == 'teacher':
            return Exam.objects.filter(teacher__user=user)  

        elif user.role == 'student':
            try:
                student = Student.objects.get(user=user)
                return Exam.objects.filter(teacher=student.assigned_teacher)  
            except Student.DoesNotExist:
                return Exam.objects.none()

        return Exam.objects.none()

class StudentExamViewSet(viewsets.ModelViewSet):
    queryset = StudentExam.objects.all()
    serializer_class = StudentExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        exam_id = self.request.query_params.get('exam')

        if user.is_superuser:
            qs = StudentExam.objects.all()

        elif user.role == 'student':
            qs = StudentExam.objects.filter(student__user=user)

        elif user.role == 'teacher':
            teacher = get_object_or_404(Teacher, user=user)
            qs = StudentExam.objects.filter(student__assigned_teacher=teacher)

        else:
            qs = StudentExam.objects.none()

        if exam_id:
            qs = qs.filter(exam_id=exam_id)

        return qs

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user.role == 'teacher' and instance.student.assigned_teacher.user != user:
            return Response({'detail': 'Not allowed to grade this submission.'}, status=403)

        instance.score = request.data.get('score', instance.score)
        instance.remarks = request.data.get('remarks', instance.remarks)
        instance.save()
        return Response(StudentExamSerializer(instance).data)

# class RegisterUserView(APIView):
#     permission_classes = [AllowAny]  
#     def post(self, request):
#         data = request.data.copy()
#         data['password'] = make_password(data['password'])
#         serializer = UserSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
#         return Response({"message": "Registration failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        role = request.data.get('role')

        if role not in ['teacher', 'student', 'admin']:
            return Response({'error': 'Invalid or missing role'}, status=400)

        # Create base user
        user_data = {
            "username": request.data.get("username"),
            "email": request.data.get("email"),
            "password": make_password(request.data.get("password")),
            "first_name": request.data.get("first_name", ""),
            "last_name": request.data.get("last_name", ""),
            "role": role
        }

        user_serializer = UserSerializer(data=user_data)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=400)

        user = user_serializer.save()

        if role == "teacher":
            teacher_data = {
                "user": user.id,
                "employee_id": request.data.get("employee_id"),
                "phone_number": request.data.get("phone_number"),
                "subject_specialization": request.data.get("subject_specialization"),
                "date_of_joining": request.data.get("date_of_joining"),
                "status": request.data.get("status", "active").lower()
            }

            serializer = TeacherSerializer(data=teacher_data)
            if serializer.is_valid():
                serializer.save()
            else:
                user.delete()  # rollback
                return Response(serializer.errors, status=400)

        elif role == "student":
            student_data = {
                "user": user.id,
                "roll_number": request.data.get("roll_number"),
                "phone_number": request.data.get("phone_number"),
                "student_class": request.data.get("student_class"),
                "date_of_birth": request.data.get("date_of_birth"),
                "admission_date": request.data.get("admission_date"),
                "status": request.data.get("status", "active").lower(),
                "assigned_teacher": request.data.get("assigned_teacher")
            }

            serializer = StudentSerializer(data=student_data)
            if serializer.is_valid():
                serializer.save()
            else:
                user.delete()  # rollback
                return Response(serializer.errors, status=400)

        return Response(user_serializer.data, status=status.HTTP_201_CREATED)


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

@api_view(['POST'])
@permission_classes([AllowAny])
def send_reset_email(request):
    email = request.data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)
    
    try:
        user = CustomUser.objects.get(email=email)
        token = serializer.dumps(email, salt='password-reset')
        reset_link = f"http://localhost:5173/reset-password/{token}"

        send_mail(
            subject="Password Reset",
            message=f"Hi {user.first_name},\nClick the link to reset your password:\n{reset_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return JsonResponse({'message': 'Password reset link sent to your email.'})

    except CustomUser.DoesNotExist:
        return JsonResponse({'error': 'Email not registered'}, status=404)


# -------------------------------
# Password Reset Using Token View
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, token):
    try:
        email = serializer.loads(token, salt='password-reset', max_age=3600)
        user = CustomUser.objects.get(email=email)

        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not new_password or not confirm_password:
            return JsonResponse({'error': 'Both password fields are required'}, status=400)

        if new_password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        user.password = make_password(new_password)
        user.save()

        return JsonResponse({'message': 'Password reset successful.'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



