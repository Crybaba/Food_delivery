# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from menu.models import Dish
from accounts.models import User


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
    dish_id = serializers.IntegerField(write_only=True, required=False)
    dish = DishSerializer(read_only=True)
    price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['dish', 'dish_id', 'quantity', 'price']

    def get_price(self, obj):
        return float(obj.dish.price) if obj.dish else 0.0

    def create(self, validated_data):
        dish_id = validated_data.pop('dish_id', None)
        if dish_id:
            return OrderItem.objects.create(dish_id=dish_id, **validated_data)
        return OrderItem.objects.create(**validated_data)


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    items = OrderItemSerializer(many=True)
    user_name = serializers.SerializerMethodField(read_only=True)
    courier_name = serializers.SerializerMethodField(read_only=True)
    user_gender = serializers.SerializerMethodField(read_only=True)  # 👈 добавляем сюда

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_name', 'user_gender', 'pickup', 'street', 'house', 'entrance', 'flat',
            'intercom', 'phone', 'persons', 'comment', 'payment', 'status',
            'courier', 'courier_name', 'created_at', 'updated_at', 'items'
        ]
        read_only_fields = [
            'status', 'courier', 'created_at', 'updated_at',
            'user_name', 'courier_name', 'user_gender'
        ]

    def get_user_name(self, obj):
        if obj.user:
            parts = [obj.user.surname, obj.user.name, obj.user.patronymic]
            return ' '.join(p for p in parts if p).strip() or obj.user.phone
        return ""

    def get_user_gender(self, obj):
        return getattr(obj.user, "gender", None)

    def get_courier_name(self, obj):
        if obj.courier:
            parts = [obj.courier.surname, obj.courier.name, obj.courier.patronymic]
            return ' '.join(p for p in parts if p).strip() or obj.courier.phone
        return ""

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

