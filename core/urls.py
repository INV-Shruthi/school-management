from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet , StudentViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('teachers', TeacherViewSet)
router.register('students', StudentViewSet)


# urlpatterns = [
#     path('api/', include(router.urls)), 
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
# ]
urlpatterns = [
    path('', include(router.urls)),

    # ✅ JWT Token URLs
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
