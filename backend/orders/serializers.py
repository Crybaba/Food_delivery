# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from menu.models import Dish
from accounts.models import User


class OrderItemSerializer(serializers.ModelSerializer):
    dish_id = serializers.IntegerField(write_only=True)
    dish = serializers.StringRelatedField(read_only=True)
    price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['dish', 'dish_id', 'quantity', 'price'] 

    def get_price(self, obj):
        return obj.dish.price if obj.dish else 0

    def create(self, validated_data):
        dish_id = validated_data.pop('dish_id')
        return OrderItem.objects.create(dish_id=dish_id, **validated_data)


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'pickup', 'street', 'house', 'entrance', 'flat', 
                  'intercom', 'phone', 'persons', 'comment', 'payment', 'status',
                  'created_at', 'updated_at', 'items']
        read_only_fields = ['status', 'courier', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

