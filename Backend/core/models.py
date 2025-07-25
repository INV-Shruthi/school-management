from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    # phone_number = models.CharField(max_length=15, null=True, blank=True) 

    def __str__(self):
        return f"{self.username} ({self.role})"

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    employee_id = models.CharField(max_length=20, unique=True)
    subject_specialization = models.CharField(max_length=100)
    date_of_joining = models.DateField()
    status = models.CharField(max_length=10, choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive')
    ])

    def __str__(self):
        return f"{self.user.username} - {self.subject_specialization}"

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    roll_number = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=15,null = True)
    student_class = models.CharField(max_length=50,null = True)
    date_of_birth = models.DateField(null=True)
    admission_date = models.DateField(null=True)
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('inactive', 'Inactive')],null = True)
    assigned_teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.roll_number}"

