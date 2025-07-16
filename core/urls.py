from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet , StudentViewSet , RegisterUserView ,UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomTokenView

router = DefaultRouter()
router.register('teachers', TeacherViewSet, basename='teacher')
router.register('students', StudentViewSet, basename='student')
router.register('users', UserViewSet, basename='user')


urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='user-register') 
    

]

