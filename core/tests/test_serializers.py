import datetime
from django.test import TestCase
from core.models import CustomUser, Teacher, Student
from core.serializers import UserSerializer, TeacherSerializer, StudentSerializer

class UserSerializerTest(TestCase):
    def test_user_serializer_valid_data(self):
        data = {
            "username": "shruthi",
            "email": "shruthi@example.com",
            "password": "testpass123",
            "first_name": "Shruthi",
            "last_name": "Murali",
            "role": "teacher"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['username'], "shruthi")
        self.assertEqual(serializer.validated_data['role'], "teacher")

class TeacherSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="teacher1",
            password="pass1234",
            first_name="Test",
            last_name="Teacher",
            role="teacher"
        )
        self.teacher = Teacher.objects.create(
            user=self.user,
            employee_id="EMP123",
            subject_specialization="Maths",
            date_of_joining=datetime.date(2022, 1, 1),
            status="active"
        )

    def test_teacher_serializer_output(self):
        serializer = TeacherSerializer(instance=self.teacher)
        self.assertEqual(serializer.data['employee_id'], "EMP123")
        self.assertEqual(serializer.data['full_name'], "Test Teacher")
        self.assertEqual(serializer.data['status'], "active")

class StudentSerializerTest(TestCase):
    def setUp(self):
        self.teacher_user = CustomUser.objects.create_user(
            username="teacher1",
            password="pass1234",
            first_name="TFirst",
            last_name="TLast",
            role="teacher"
        )
        self.teacher = Teacher.objects.create(
            user=self.teacher_user,
            employee_id="EMP001",
            subject_specialization="Science",
            date_of_joining=datetime.date(2021, 5, 20),
            status="active"
        )

        self.student_user = CustomUser.objects.create_user(
            username="student1",
            password="pass5678",
            first_name="SFirst",
            last_name="SLast",
            role="student"
        )

        self.student = Student.objects.create(
            user=self.student_user,
            roll_number="ROLL001",
            phone_number="9999999999",
            student_class="10-A",
            date_of_birth=datetime.date(2005, 8, 15),
            admission_date=datetime.date(2022, 6, 1),
            status="active",
            assigned_teacher=self.teacher
        )

    def test_student_serializer_output(self):
        serializer = StudentSerializer(instance=self.student)
        self.assertEqual(serializer.data['roll_number'], "ROLL001")
        self.assertEqual(serializer.data['student_name'], "SFirst SLast")
        self.assertEqual(serializer.data['assigned_teacher_name'], "TFirst TLast")
        self.assertEqual(serializer.data['status'], "active")
