from django.shortcuts import render
from rest_framework import viewsets ,permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Teacher, Student
from .serializers import TeacherSerializer, StudentSerializer, StudentNameSerializer




class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.DjangoModelPermissions] 

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        teacher = self.get_object()
        students = Student.objects.filter(assigned_teacher=teacher)
        serializer = StudentNameSerializer(students, many=True)
        return Response(serializer.data)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.DjangoModelPermissions] 
   

    def get_queryset(self):
        teacher_id = self.request.query_params.get('teacher')
        if teacher_id:
            return Student.objects.filter(assigned_teacher__id=teacher_id)
        return Student.objects.all()
