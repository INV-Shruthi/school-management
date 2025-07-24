import datetime
from django.test import TestCase
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import CustomUser, Teacher, Student, Exam, Question, StudentAnswer, StudentExam
from core.serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    TeacherSerializer,
    StudentSerializer,
    StudentNameSerializer,
    QuestionSerializer,
    ExamSerializer,
    StudentAnswerSerializer,
    StudentExamSerializer
)


class CustomTokenSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='testpass123',
            role='teacher'
        )

    def test_token_serializer_output(self):
        data = {"username": "testuser", "password": "testpass123"}
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertIn('access', serializer.validated_data)
        self.assertIn('refresh', serializer.validated_data)
        self.assertEqual(serializer.validated_data['username'], 'testuser')
        self.assertEqual(serializer.validated_data['role'], 'teacher')


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


class StudentNameSerializerTest(TestCase):
    def test_student_name_serializer_output(self):
        user = CustomUser.objects.create_user(
            username="student1", first_name="A", last_name="B", password="pass", role="student"
        )
        teacher = Teacher.objects.create(
            user=CustomUser.objects.create_user(username="t", password="p", role="teacher"),
            employee_id="E1", subject_specialization="Math", date_of_joining=datetime.date(2020, 1, 1), status="active"
        )
        student = Student.objects.create(
            user=user,
            roll_number="001",
            phone_number="1234567890",
            student_class="10A",
            date_of_birth="2005-01-01",
            admission_date="2020-06-01",
            status="active",
            assigned_teacher=teacher
        )
        serializer = StudentNameSerializer(student)
        self.assertEqual(serializer.data['name'], "A B")


class QuestionSerializerTest(TestCase):
    def test_question_serializer_output(self):
        teacher = Teacher.objects.create(
            user=CustomUser.objects.create_user(username="t", password="p", role="teacher"),
            employee_id="E2", subject_specialization="English", date_of_joining=datetime.date(2020, 1, 1), status="active"
        )
        exam = Exam.objects.create(title="Midterm", teacher=teacher)
        question = Question.objects.create(exam=exam, text="What is Python?")
        serializer = QuestionSerializer(question)
        self.assertEqual(serializer.data['text'], "What is Python?")


class ExamSerializerTest(TestCase):
    def test_exam_serializer_create(self):
        teacher = Teacher.objects.create(
            user=CustomUser.objects.create_user(username="t", password="p", role="teacher"),
            employee_id="E3", subject_specialization="CS", date_of_joining=datetime.date(2020, 1, 1), status="active"
        )
        data = {
            "title": "Unit Test",
            "teacher": teacher.id,
            "questions": [{"text": "Q1?"}, {"text": "Q2?"}]
        }
        serializer = ExamSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        exam = serializer.save()
        self.assertEqual(exam.title, "Unit Test")
        self.assertEqual(exam.questions.count(), 2)


class StudentAnswerSerializerTest(TestCase):
    def test_student_answer_serializer(self):
        teacher = Teacher.objects.create(
            user=CustomUser.objects.create_user(username="t", password="p", role="teacher"),
            employee_id="E4", subject_specialization="CS", date_of_joining=datetime.date(2020, 1, 1), status="active"
        )
        exam = Exam.objects.create(title="Test", teacher=teacher)
        question = Question.objects.create(exam=exam, text="Explain OOPs?")
        student = Student.objects.create(
            user=CustomUser.objects.create_user(username="s", password="p", role="student"),
            roll_number="R1", phone_number="123", student_class="X", date_of_birth="2000-01-01", admission_date="2020-01-01", status="active", assigned_teacher=teacher
        )
        student_exam = StudentExam.objects.create(student=student, exam=exam)
        answer = StudentAnswer.objects.create(student_exam=student_exam, question=question, answer_text="Object Oriented")
        serializer = StudentAnswerSerializer(instance=answer)
        self.assertEqual(serializer.data['answer_text'], "Object Oriented")


class StudentExamSerializerTest(TestCase):
    def test_student_exam_serializer_create(self):
        teacher = Teacher.objects.create(
            user=CustomUser.objects.create_user(username="t", password="p", role="teacher"),
            employee_id="E5", subject_specialization="Bio", date_of_joining=datetime.date(2020, 1, 1), status="active"
        )
        student_user = CustomUser.objects.create_user(username="stu", password="123", role="student")
        student = Student.objects.create(
            user=student_user, roll_number="R2", phone_number="888", student_class="XII",
            date_of_birth="2003-01-01", admission_date="2021-01-01", status="active", assigned_teacher=teacher
        )
        exam = Exam.objects.create(title="Biology Test", teacher=teacher)
        question1 = Question.objects.create(exam=exam, text="Q1?")
        question2 = Question.objects.create(exam=exam, text="Q2?")
        data = {
            "student": student.id,
            "exam": exam.id,
            "answers": [
                {"question": question1.id, "answer_text": "A1"},
                {"question": question2.id, "answer_text": "A2"}
            ]
        }
        serializer = StudentExamSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        student_exam = serializer.save()
        self.assertEqual(student_exam.answers.count(), 2)
