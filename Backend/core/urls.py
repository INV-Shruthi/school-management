from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TeacherViewSet,
    StudentViewSet,
    UserViewSet,
    import_students_csv,
    CustomTokenView,
    send_reset_email,
    reset_password,
    ExamViewSet,
    StudentExamViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView

# DRF Routers
router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
router.register('students', StudentViewSet, basename='student')
router.register('users', UserViewSet, basename='user')
router.register('exams', ExamViewSet, basename='exam')
router.register('student-exams', StudentExamViewSet, basename='student-exam')

urlpatterns = [
    path('', include(router.urls)),

    # Auth
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # CSV Import
    path('import/students/', import_students_csv, name='import-students'),

    # Password Reset
    path('reset-password-link/', send_reset_email, name='send-reset-email'),
    path('reset-password/<str:token>/', reset_password, name='reset-password'),
]
