from rest_framework import serializers
from .models import User


# serializers.py
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # confirm_password = serializers.CharField(write_only=True)  <- убрать

    class Meta:
        model = User
        fields = ("phone", "surname", "name", "patronymic", "gender", "password")

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)
