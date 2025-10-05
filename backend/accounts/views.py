from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from orders.models import Order  # если у тебя заказы в app "orders"
from .permissions import IsAdmin
from .models import User, Cart, CartItem
from .serializers import RegisterSerializer, LoginSerializer, CartSerializer, CartItemSerializer


# -----------------------
# Аутентификация
# -----------------------

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "user_id": user.id,
            "phone": user.phone,
            "role": user.role
        }
        return Response(data)

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
                "role": user.role
            })
        return Response({"error": "Неверный телефон или пароль"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "Вы вышли"})


# -----------------------
# Корзина
# -----------------------
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dish = serializer.validated_data["dish"]
        quantity = serializer.validated_data.get("quantity", 1)

        item, created = CartItem.objects.get_or_create(cart=cart, dish=dish)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        dish_id = request.data.get("dish_id")

        try:
            item = CartItem.objects.get(cart=cart, dish_id=dish_id)
            if item.quantity > 1:
                item.quantity -= 1
                item.save()
            else:
                item.delete()
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Блюдо не найдено в корзине"}, status=status.HTTP_404_NOT_FOUND)


class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({"message": "Корзина очищена"})

# -----------------------
# Управление курьерами (для администратора)
# -----------------------


class AllUsersView(generics.ListAPIView):
    """
    Возвращает всех пользователей (для поиска по телефону)
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def list(self, request, *args, **kwargs):
        users = self.get_queryset().values("id", "surname", "name", "patronymic", "phone", "role")
        return Response(list(users))


class AddCourierView(APIView):
    """
    Назначает пользователю роль 'courier' по номеру телефона
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"error": "Не указан номер телефона"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"error": "Пользователь с таким номером не найден"}, status=status.HTTP_404_NOT_FOUND)

        if user.role == "courier":
            return Response({"message": "Этот пользователь уже является курьером"}, status=status.HTTP_200_OK)

        user.role = "COURIER"
        user.save()
        return Response({"message": f"Пользователь {user.phone} теперь курьер"}, status=status.HTTP_200_OK)


class RemoveCourierView(APIView):
    """
    Снимает роль 'courier' с пользователя
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, courier_id):
        try:
            user = User.objects.get(id=courier_id)
        except User.DoesNotExist:
            return Response({"error": "Курьер не найден"}, status=status.HTTP_404_NOT_FOUND)

        if user.role != "courier":
            return Response({"error": "Этот пользователь не является курьером"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = "USER"
        user.save()
        return Response({"message": f"Курьер {user.phone} удалён"}, status=status.HTTP_200_OK)


class CourierActiveOrdersView(APIView):
    """
    Возвращает количество незавершённых заказов у курьера
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, courier_id):
        try:
            courier = User.objects.get(id=courier_id, role="courier")
        except User.DoesNotExist:
            return Response({"error": "Курьер не найден"}, status=status.HTTP_404_NOT_FOUND)

        active_orders = Order.objects.filter(
            courier=courier,
            status__in=["processing", "preparing", "delivering"]
        ).count()

        return Response({"active_orders": active_orders})
