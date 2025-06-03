from django.urls import path
from .views import RegisterView, ProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [path('register/', RegisterView.as_view(),
                    name='register'),
               path('profile/', ProfileView.as_view(),
                    name='profile'),
               path('login/', TokenObtainPairView.as_view(),
                    name='token_obtain_pair'),
               path('token/refresh/', TokenRefreshView.as_view(),
                    name='token_refresh'),
               path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),]
