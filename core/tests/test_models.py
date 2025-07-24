from django.test import TestCase
from django.utils import timezone
from core.models import (
    CustomUser, Teacher, Student,
    Exam, Question, StudentExam, StudentAnswer
)

class ModelTestCase(TestCase):

    def setUp(self):
        # Users
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

        # Teacher and Student
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

        # Exam and Questions
        self.exam = Exam.objects.create(
            title='Midterm Math Exam',
            teacher=self.teacher
        )

        self.question1 = Question.objects.create(
            exam=self.exam,
            text='What is 2 + 2?'
        )
        self.question2 = Question.objects.create(
            exam=self.exam,
            text='What is 10 / 2?'
        )

        # StudentExam and StudentAnswer
        self.student_exam = StudentExam.objects.create(
            exam=self.exam,
            student=self.student,
            score=8,
            remarks='Good attempt'
        )

        self.answer1 = StudentAnswer.objects.create(
            student_exam=self.student_exam,
            question=self.question1,
            answer_text='4'
        )
        self.answer2 = StudentAnswer.objects.create(
            student_exam=self.student_exam,
            question=self.question2,
            answer_text='5'
        )

    # Tests for CustomUser, Teacher, Student
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

    # New tests for Exam and Questions
    def test_exam_creation(self):
        self.assertEqual(self.exam.title, 'Midterm Math Exam')
        self.assertEqual(self.exam.teacher, self.teacher)

    def test_question_creation(self):
        self.assertEqual(self.question1.text, 'What is 2 + 2?')
        self.assertEqual(self.question1.exam, self.exam)

    # New tests for StudentExam
    def test_student_exam_relationship(self):
        self.assertEqual(self.student_exam.exam, self.exam)
        self.assertEqual(self.student_exam.student, self.student)
        self.assertEqual(self.student_exam.score, 8)
        self.assertEqual(self.student_exam.remarks, 'Good attempt')

    # New tests for StudentAnswer
    def test_student_answers(self):
        self.assertEqual(self.answer1.answer_text, '4')
        self.assertEqual(self.answer1.question, self.question1)
        self.assertEqual(self.answer1.student_exam, self.student_exam)

    def test_student_answer_str(self):
        # Truncated question text for __str__ representation
        self.assertTrue(str(self.answer1).startswith('student1 - What is 2'))
