from rest_framework import serializers
from .models import Dish

class DishSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'description', 'price', 'weight',
            'calories', 'image', 'is_available', 'category',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class DishCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = [
            'name', 'description', 'price', 'weight',
            'calories', 'image', 'is_available', 'category'
        ]
    
    def validate_name(self, value):
        """Валидация названия"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Название должно содержать минимум 2 символа")
        return value.strip()

class DishUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = [
            'name', 'description', 'price', 'weight',
            'calories', 'image', 'is_available', 'category'
        ]
    
    def validate_name(self, value):
        """Валидация названия"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Название должно содержать минимум 2 символа")
        return value.strip() if value else value
