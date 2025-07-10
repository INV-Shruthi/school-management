from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
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


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()  # ✅ Add this line

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
    # permission_classes = [permissions.IsAdminUser]


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
