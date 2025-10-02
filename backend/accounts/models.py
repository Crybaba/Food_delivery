# accounts/models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from menu.models import Dish  # правильный импорт модели Dish


# -----------------------
# Пользователи
# -----------------------
class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Номер телефона обязателен")
        phone = str(phone).strip()
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("USER", "Пользователь"),
        ("COURIER", "Курьер"),
        ("ADMIN", "Администратор"),
    )

    phone = models.CharField(max_length=10, unique=True, help_text="Номер без +7")
    surname = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=100, blank=True)
    patronymic = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=1, choices=(("M", "М"), ("F", "Ж")), blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="USER")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # доступ в админку

    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.phone} ({self.role})"


# -----------------------
# Корзина
# -----------------------
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")

    def clear(self):
        self.items.all().delete()

    def total_price(self):
        return sum(item.subtotal() for item in self.items.all())

    def __str__(self):
        return f"Корзина пользователя {self.user.phone}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)  # исправлено на правильный импорт
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.dish.price * self.quantity

    def __str__(self):
        return f"{self.dish.name} x {self.quantity}"
