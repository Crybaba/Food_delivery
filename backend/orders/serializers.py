from rest_framework import serializers
from .models import Order, OrderItem, OrderStatus
from menu.models import Dish
from menu.serializers import DishSerializer

class OrderStatusSerializer(serializers.ModelSerializer):
    """Сериализатор для статусов заказа"""
    
    class Meta:
        model = OrderStatus
        fields = ['id', 'name', 'description', 'is_final', 'color']

class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для позиций заказа"""
    dish = DishSerializer(read_only=True)
    dish_id = serializers.IntegerField(write_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'dish', 'dish_id', 'quantity', 'price', 'total']
        read_only_fields = ['id', 'price']
    
    def get_total(self, obj):
        """Расчет общей стоимости позиции"""
        return obj.get_total()
    
    def validate_dish_id(self, value):
        """Валидация существования блюда"""
        try:
            dish = Dish.objects.get(id=value)
            if not dish.is_available:
                raise serializers.ValidationError("Блюдо недоступно для заказа")
        except Dish.DoesNotExist:
            raise serializers.ValidationError("Блюдо не найдено")
        return value
    
    def validate_quantity(self, value):
        """Валидация количества"""
        if value <= 0:
            raise serializers.ValidationError("Количество должно быть больше 0")
        if value > 50:
            raise serializers.ValidationError("Количество не может превышать 50")
        return value

class OrderItemCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания позиций заказа"""
    dish_id = serializers.IntegerField()
    
    class Meta:
        model = OrderItem
        fields = ['dish_id', 'quantity']
    
    def validate_dish_id(self, value):
        """Валидация существования блюда"""
        try:
            dish = Dish.objects.get(id=value)
            if not dish.is_available:
                raise serializers.ValidationError("Блюдо недоступно для заказа")
        except Dish.DoesNotExist:
            raise serializers.ValidationError("Блюдо не найдено")
        return value
    
    def validate_quantity(self, value):
        """Валидация количества"""
        if value <= 0:
            raise serializers.ValidationError("Количество должно быть больше 0")
        if value > 50:
            raise serializers.ValidationError("Количество не может превышать 50")
        return value

class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для заказов"""
    items = OrderItemSerializer(many=True, read_only=True)
    status = OrderStatusSerializer(read_only=True)
    status_id = serializers.IntegerField(write_only=True, required=False)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_name', 'status', 'status_id', 'total_amount',
            'payment_method', 'delivery_address', 'delivery_phone', 
            'delivery_notes', 'created_at', 'updated_at', 'delivered_at', 'items'
        ]
        read_only_fields = ['id', 'user', 'total_amount', 'created_at', 'updated_at', 'delivered_at']
    
    def get_user_name(self, obj):
        """Получение имени пользователя"""
        return f"{obj.user.first_name} {obj.user.last_name}"
    
    def validate_delivery_address(self, value):
        """Валидация адреса доставки"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Адрес доставки должен содержать минимум 10 символов")
        return value.strip()
    
    def validate_delivery_phone(self, value):
        """Валидация телефона"""
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Некорректный номер телефона")
        return value

class OrderCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания заказа"""
    items = OrderItemCreateSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'payment_method', 'delivery_address', 'delivery_phone', 
            'delivery_notes', 'items'
        ]
    
    def validate_items(self, value):
        """Валидация позиций заказа"""
        if not value:
            raise serializers.ValidationError("Заказ должен содержать хотя бы одну позицию")
        
        # Проверка на дубликаты блюд
        dish_ids = [item['dish_id'] for item in value]
        if len(dish_ids) != len(set(dish_ids)):
            raise serializers.ValidationError("В заказе не может быть дублирующихся блюд")
        
        return value
    
    def validate_delivery_address(self, value):
        """Валидация адреса доставки"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Адрес доставки должен содержать минимум 10 символов")
        return value.strip()
    
    def validate_delivery_phone(self, value):
        """Валидация телефона"""
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Некорректный номер телефона")
        return value
    
    def create(self, validated_data):
        """Создание заказа с позициями"""
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        # Создаем заказ
        order = Order.objects.create(user=user, **validated_data)
        
        # Создаем позиции заказа
        for item_data in items_data:
            dish = Dish.objects.get(id=item_data['dish_id'])
            OrderItem.objects.create(
                order=order,
                dish=dish,
                quantity=item_data['quantity'],
                price=dish.price
            )
        
        # Рассчитываем общую сумму
        order.calculate_total()
        
        return order

class OrderUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления заказа"""
    
    class Meta:
        model = Order
        fields = [
            'status_id', 'payment_method', 'delivery_address', 
            'delivery_phone', 'delivery_notes', 'delivered_at'
        ]
    
    def validate_delivery_address(self, value):
        """Валидация адреса доставки"""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError("Адрес доставки должен содержать минимум 10 символов")
        return value.strip() if value else value
    
    def validate_delivery_phone(self, value):
        """Валидация телефона"""
        if value and (not value.isdigit() or len(value) < 10):
            raise serializers.ValidationError("Некорректный номер телефона")
        return value
