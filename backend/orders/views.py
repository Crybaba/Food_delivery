from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer
from .permissions import IsAdmin, IsCourier

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Order.objects.all()
        elif user.role == "COURIER":
            return Order.objects.filter(courier=user)
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Order.objects.all()
        elif user.role == "COURIER":
            return Order.objects.filter(courier=user)
        return Order.objects.filter(user=user)


class AssignCourierView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Заказ не найден"}, status=status.HTTP_404_NOT_FOUND)

        courier_id = request.data.get("courier_id")
        from accounts.models import User  

        try:
            courier = User.objects.get(pk=courier_id, role="COURIER")
        except User.DoesNotExist:
            return Response({"error": "Курьер не найден"}, status=status.HTTP_400_BAD_REQUEST)

        order.courier = courier
        order.save()
        return Response(OrderSerializer(order).data)


class UpdateStatusView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Заказ не найден"}, status=status.HTTP_404_NOT_FOUND)

        status_value = request.data.get("status")
        if status_value not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Некорректный статус"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = status_value
        order.save()
        return Response(OrderSerializer(order).data)
