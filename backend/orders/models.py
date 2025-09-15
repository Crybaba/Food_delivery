from django.db import models
from django.utils import timezone
from accounts.models import User
from menu.models import Dish

class OrderStatus(models.Model):
    """Статусы заказа"""
    name = models.CharField(max_length=50, verbose_name="Название статуса")
    description = models.TextField(blank=True, verbose_name="Описание")
    is_final = models.BooleanField(default=False, verbose_name="Финальный статус")
    color = models.CharField(max_length=7, default="#007bff", verbose_name="Цвет")
    
    class Meta:
        verbose_name = "Статус заказа"
        verbose_name_plural = "Статусы заказов"
        ordering = ['id']
    
    def __str__(self):
        return self.name

class Order(models.Model):
    """Модель заказа"""
    PAYMENT_METHODS = [
        ('cash', 'Наличные'),
        ('card', 'Банковская карта'),
        ('online', 'Онлайн оплата'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    status = models.ForeignKey(OrderStatus, on_delete=models.SET_NULL, null=True, verbose_name="Статус")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Общая сумма")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='cash', verbose_name="Способ оплаты")
    delivery_address = models.TextField(verbose_name="Адрес доставки")
    delivery_phone = models.CharField(max_length=20, verbose_name="Телефон для доставки")
    delivery_notes = models.TextField(blank=True, verbose_name="Примечания к доставке")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    delivered_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата доставки")
    
    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Заказ #{self.id} от {self.user.first_name} {self.user.last_name}"
    
    def calculate_total(self):
        """Расчет общей суммы заказа"""
        total = sum(item.get_total() for item in self.orderitem_set.all())
        self.total_amount = total
        self.save()
        return total

class OrderItem(models.Model):
    """Позиции в заказе"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name="Заказ")
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, verbose_name="Блюдо")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Цена за единицу")
    
    class Meta:
        verbose_name = "Позиция заказа"
        verbose_name_plural = "Позиции заказа"
        unique_together = ['order', 'dish']
    
    def __str__(self):
        return f"{self.dish.name} x{self.quantity}"
    
    def get_total(self):
        """Расчет общей стоимости позиции"""
        return self.quantity * self.price
