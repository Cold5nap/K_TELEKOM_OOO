from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class ProfileView(APIView):
    serializer_class = UserSerializer
    """
    Профиль пользователя (требуется аутентификация)
    """
    permission_classes = [IsAuthenticated]  # Только для авторизованных
    def get(self, request, format=None):
        """
        Получение данных профиля текущего пользователя
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)