from rest_framework import serializers
from .models import Dish

class DishSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Dish"""
    
    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'description', 'price', 'weight', 
            'calories', 'image', 'is_available', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_price(self, value):
        """Валидация цены"""
        if value <= 0:
            raise serializers.ValidationError("Цена должна быть больше 0")
        return value
    
    def validate_weight(self, value):
        """Валидация веса"""
        if value <= 0:
            raise serializers.ValidationError("Вес должен быть больше 0")
        return value
    
    def validate_calories(self, value):
        """Валидация калорий"""
        if value < 0:
            raise serializers.ValidationError("Калории не могут быть отрицательными")
        return value

class DishCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания блюда"""
    
    class Meta:
        model = Dish
        fields = [
            'name', 'description', 'price', 'weight', 
            'calories', 'image', 'is_available'
        ]
    
    def validate_name(self, value):
        """Валидация названия"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Название должно содержать минимум 2 символа")
        return value.strip()

class DishUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления блюда"""
    
    class Meta:
        model = Dish
        fields = [
            'name', 'description', 'price', 'weight', 
            'calories', 'image', 'is_available'
        ]
    
    def validate_name(self, value):
        """Валидация названия"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Название должно содержать минимум 2 символа")
        return value.strip() if value else value
