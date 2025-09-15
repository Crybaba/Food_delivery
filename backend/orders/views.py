from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from .models import Order, OrderItem, OrderStatus
from .serializers import (
    OrderSerializer, OrderCreateSerializer, OrderUpdateSerializer,
    OrderItemSerializer, OrderStatusSerializer
)

class OrderStatusViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для статусов заказов (только чтение)"""
    queryset = OrderStatus.objects.all()
    serializer_class = OrderStatusSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления заказами.
    Поддерживает все CRUD операции: создание, чтение, обновление, удаление.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'payment_method']
    search_fields = ['delivery_address', 'delivery_phone']
    ordering_fields = ['created_at', 'total_amount', 'delivered_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Получение заказов пользователя"""
        user = self.request.user
        if user.is_staff:
            # Администраторы видят все заказы
            return Order.objects.all().select_related('user', 'status').prefetch_related('orderitem_set__dish')
        else:
            # Обычные пользователи видят только свои заказы
            return Order.objects.filter(user=user).select_related('user', 'status').prefetch_related('orderitem_set__dish')
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """Создание нового заказа"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Возвращаем созданный заказ с полным сериализатором
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Обновление заказа"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Проверяем права на изменение заказа
        if not request.user.is_staff and instance.user != request.user:
            return Response(
                {'detail': 'У вас нет прав на изменение этого заказа'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Возвращаем обновленный заказ с полным сериализатором
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Удаление заказа"""
        instance = self.get_object()
        
        # Проверяем права на удаление заказа
        if not request.user.is_staff and instance.user != request.user:
            return Response(
                {'detail': 'У вас нет прав на удаление этого заказа'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Проверяем, можно ли удалить заказ
        if instance.status and instance.status.is_final:
            return Response(
                {'detail': 'Нельзя удалить заказ с финальным статусом'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        """Добавление позиции в заказ"""
        order = self.get_object()
        
        # Проверяем права на изменение заказа
        if not request.user.is_staff and order.user != request.user:
            return Response(
                {'detail': 'У вас нет прав на изменение этого заказа'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Проверяем, можно ли изменить заказ
        if order.status and order.status.is_final:
            return Response(
                {'detail': 'Нельзя изменить заказ с финальным статусом'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = OrderItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Проверяем, есть ли уже такое блюдо в заказе
        dish_id = serializer.validated_data['dish_id']
        existing_item = order.orderitem_set.filter(dish_id=dish_id).first()
        
        if existing_item:
            # Увеличиваем количество существующей позиции
            existing_item.quantity += serializer.validated_data['quantity']
            existing_item.save()
        else:
            # Создаем новую позицию
            dish = serializer.validated_data['dish_id']
            OrderItem.objects.create(
                order=order,
                dish=dish,
                quantity=serializer.validated_data['quantity'],
                price=dish.price
            )
        
        # Пересчитываем общую сумму
        order.calculate_total()
        
        # Возвращаем обновленный заказ
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        """Удаление позиции из заказа"""
        order = self.get_object()
        
        # Проверяем права на изменение заказа
        if not request.user.is_staff and order.user != request.user:
            return Response(
                {'detail': 'У вас нет прав на изменение этого заказа'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Проверяем, можно ли изменить заказ
        if order.status and order.status.is_final:
            return Response(
                {'detail': 'Нельзя изменить заказ с финальным статусом'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        dish_id = request.data.get('dish_id')
        if not dish_id:
            return Response(
                {'detail': 'Необходимо указать dish_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            item = order.orderitem_set.get(dish_id=dish_id)
            item.delete()
            
            # Пересчитываем общую сумму
            order.calculate_total()
            
            # Возвращаем обновленный заказ
            response_serializer = OrderSerializer(order)
            return Response(response_serializer.data)
        except OrderItem.DoesNotExist:
            return Response(
                {'detail': 'Позиция не найдена в заказе'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def update_item_quantity(self, request, pk=None):
        """Обновление количества позиции в заказе"""
        order = self.get_object()
        
        # Проверяем права на изменение заказа
        if not request.user.is_staff and order.user != request.user:
            return Response(
                {'detail': 'У вас нет прав на изменение этого заказа'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Проверяем, можно ли изменить заказ
        if order.status and order.status.is_final:
            return Response(
                {'detail': 'Нельзя изменить заказ с финальным статусом'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        dish_id = request.data.get('dish_id')
        quantity = request.data.get('quantity')
        
        if not dish_id or not quantity:
            return Response(
                {'detail': 'Необходимо указать dish_id и quantity'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if quantity <= 0:
            return Response(
                {'detail': 'Количество должно быть больше 0'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            item = order.orderitem_set.get(dish_id=dish_id)
            item.quantity = quantity
            item.save()
            
            # Пересчитываем общую сумму
            order.calculate_total()
            
            # Возвращаем обновленный заказ
            response_serializer = OrderSerializer(order)
            return Response(response_serializer.data)
        except OrderItem.DoesNotExist:
            return Response(
                {'detail': 'Позиция не найдена в заказе'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Получение заказов текущего пользователя"""
        orders = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Получение активных заказов (не финальных)"""
        active_orders = self.get_queryset().filter(
            Q(status__isnull=True) | Q(status__is_final=False)
        )
        serializer = self.get_serializer(active_orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Получение завершенных заказов"""
        completed_orders = self.get_queryset().filter(status__is_final=True)
        serializer = self.get_serializer(completed_orders, many=True)
        return Response(serializer.data)
