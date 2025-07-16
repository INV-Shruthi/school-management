from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"

# ---------------------------
# Teacher Model
# ---------------------------
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
    # Temporary minimal model to avoid import error
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    roll_number = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.user.username} - {self.roll_number}"

