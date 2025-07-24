from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from core.models import CustomUser, Teacher, Student, Exam, Question, StudentExam, StudentAnswer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
import datetime

class ViewsTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Create admin user
        self.admin_user = CustomUser.objects.create_superuser(
            username='admin', password='adminpass', email='admin@example.com'
        )

        # Create teacher user and teacher profile
        self.teacher_user = CustomUser.objects.create_user(
            username='teacher1', password='teachpass', role='teacher'
        )
        self.teacher = Teacher.objects.create(
            user=self.teacher_user,
            employee_id='EMP001',
            subject_specialization='Math',
            date_of_joining='2023-01-01',
            status='active'
        )

        # Create student user and student profile
        self.student_user = CustomUser.objects.create_user(
            username='student1', password='studpass', role='student'
        )
        self.student = Student.objects.create(
            user=self.student_user,
            roll_number='R001',
            phone_number='1234567890',
            student_class='10-A',
            date_of_birth='2005-05-10',
            admission_date='2020-06-01',
            status='active',
            assigned_teacher=self.teacher
        )
    def authenticate(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

    def test_admin_can_export_teachers_csv(self):
        self.authenticate(self.admin_user)
        url = reverse('teacher-export-teachers-csv')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_teacher_can_export_students_csv(self):
        self.authenticate(self.teacher_user)
        url = reverse('student-export-students-csv')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_student_cannot_export_csv(self):
        self.authenticate(self.student_user)
        url = reverse('student-export-students-csv')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)

    def test_teacher_get_own_students(self):
        self.authenticate(self.teacher_user)
        url = reverse('student-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        assigned_students = [
            s for s in response.data['results']
            if s['assigned_teacher_name'].strip() == f"{self.teacher_user.first_name} {self.teacher_user.last_name}".strip()
        ]
        self.assertEqual(len(assigned_students), 1)

    def test_admin_can_get_all_teachers(self):
        self.authenticate(self.admin_user)
        url = reverse('teacher-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


    # ---------- Exam ViewSet ----------
    def test_teacher_can_create_exam(self):
        self.authenticate(self.teacher_user)
        url = reverse('exam-list')
        data = {
            "title": "Math Final",
            "teacher": self.teacher.id, 
            "questions": [
                {"text": "What is 2 + 2?", "marks": 2},
                {"text": "What is 10 - 3?", "marks": 3},
                {"text": "What is 5 x 6?", "marks": 4},
                {"text": "What is 15 ÷ 3?", "marks": 1},
                {"text": "What is 9 + 10?", "marks": 2}
            ],
            "assigned_students": [self.student.id]
        }
        response = self.client.post(url, data, format='json')
        print("CREATE EXAM RESPONSE =>", response.data)
        self.assertEqual(response.status_code, 201)

    # ---------- StudentExam ViewSet ----------
    def test_student_exam_submission_and_teacher_grading(self):
        exam = Exam.objects.create(
            title="Physics Test",
            teacher=self.teacher
        )
        student_exam = StudentExam.objects.create(
            student=self.student,
            exam=exam,
            score=0,
            remarks=""
        )

        self.authenticate(self.teacher_user)
        url = reverse('student-exam-detail', kwargs={'pk': student_exam.id})
        response = self.client.put(url, {'score': 85, 'remarks': "Good work"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['score'], 85)

