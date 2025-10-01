from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


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
    is_staff = models.BooleanField(default=False)  # для доступа в админку, если вдруг понадобится

    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.phone} ({self.role})"