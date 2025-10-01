from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import AllowAny

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": {
                "id": user.id,
                "phone": user.phone,
                "surname": user.surname,
                "name": user.name,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request, 
            phone=serializer.validated_data["phone"], 
            password=serializer.validated_data["password"]
        )
        if user:
            login(request, user)
            return Response({
                "message": "Успешный вход",
                "user_id": user.id,
                "phone": user.phone,
                "role": user.role  # добавили роль
            })
        return Response(
            {"error": "Неверный телефон или пароль"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        logout(request)
        return Response({"message": "Вы вышли"})
