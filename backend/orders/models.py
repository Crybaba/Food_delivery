from django.db import models
from django.conf import settings
from menu.models import Dish  # модель блюда

class Order(models.Model):
    STATUS_CHOICES = [
        ("processing", "В обработке"),
        ("preparing", "Готовится"),
        ("delivering", "Доставляется"),
        ("completed", "Завершён"),
    ]

    PAYMENT_CHOICES = [
        ("cash", "Наличные"),
        ("card", "Картой при получении"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Заказчик"
    )

    pickup = models.BooleanField(default=False, verbose_name="Самовывоз")

    street = models.CharField(max_length=255, blank=True, null=True)
    house = models.CharField(max_length=10, blank=True, null=True)
    entrance = models.CharField(max_length=10, blank=True, null=True)
    flat = models.CharField(max_length=10, blank=True, null=True)
    intercom = models.CharField(max_length=20, blank=True, null=True)

    phone = models.CharField(max_length=20)
    persons = models.PositiveIntegerField(default=1)
    comment = models.TextField(blank=True, null=True)
    payment = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default="cash")

    courier = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="deliveries",
        verbose_name="Курьер"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="processing")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    dishes = models.ManyToManyField(
        Dish,
        through='OrderItem',  # промежуточная модель для количества
        related_name='orders'
    )

    def save(self, *args, **kwargs):
        if self.pickup:  # если самовывоз — адрес не нужен
            self.street = None
            self.house = None
            self.entrance = None
            self.flat = None
            self.intercom = None
            self.persons = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Заказ #{self.pk} ({self.user.phone})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('order', 'dish')

    def __str__(self):
        return f"{self.dish.name} x {self.quantity} (заказ #{self.order.pk})"
