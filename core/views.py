from django.shortcuts import render
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
    UserSerializer,CustomTokenObtainPairSerializer
)

# ✅ Teacher ViewSet
class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    # GET /api/teachers/{id}/students/
    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        teacher = self.get_object()
        students = Student.objects.filter(assigned_teacher=teacher)
        serializer = StudentNameSerializer(students, many=True)
        return Response(serializer.data)


# ✅ Student ViewSet
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    # Optional filter: /api/students/?teacher=2
    def get_queryset(self):
        teacher_id = self.request.query_params.get('teacher')
        if teacher_id:
            return Student.objects.filter(assigned_teacher__id=teacher_id)
        return Student.objects.all()


# ✅ Register User API
class RegisterUserView(APIView):
    def post(self, request):
        data = request.data.copy()
        data['password'] = make_password(data['password'])  # Hash the password
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.DjangoModelPermissions]

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
