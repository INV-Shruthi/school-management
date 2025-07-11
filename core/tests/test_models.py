from django.test import TestCase
from django.utils import timezone
from core.models import CustomUser, Teacher, Student

class ModelTestCase(TestCase):

    def setUp(self):
        self.teacher_user = CustomUser.objects.create_user(
            username='teacher1',
            password='pass1234',
            role='teacher'
        )
        self.student_user = CustomUser.objects.create_user(
            username='student1',
            password='pass1234',
            role='student'
        )

        self.teacher = Teacher.objects.create(
            user=self.teacher_user,
            employee_id='EMP001',
            subject_specialization='Mathematics',
            date_of_joining=timezone.now().date(),
            status='active'
        )

        self.student = Student.objects.create(
            user=self.student_user,
            roll_number='STU001',
            phone_number='9876543210',
            student_class='10th Grade',
            date_of_birth='2008-01-15',
            admission_date='2022-06-01',
            status='active',
            assigned_teacher=self.teacher
        )

    def test_teacher_str(self):
        self.assertEqual(str(self.teacher), 'teacher1 - Mathematics')

    def test_student_str(self):
        self.assertEqual(str(self.student), 'student1 - STU001')

    def test_custom_user_roles(self):
        self.assertEqual(self.teacher_user.role, 'teacher')
        self.assertEqual(self.student_user.role, 'student')

    def test_teacher_fields(self):
        self.assertEqual(self.teacher.employee_id, 'EMP001')
        self.assertEqual(self.teacher.status, 'active')

    def test_student_relationships(self):
        self.assertEqual(self.student.assigned_teacher, self.teacher)
        self.assertEqual(self.student.user.username, 'student1')
