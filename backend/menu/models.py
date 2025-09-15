from django.db import models
from django.utils import timezone

class Dish(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название блюда")
    description = models.TextField(verbose_name="Описание")
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Цена") 
    weight = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Вес (г)") 
    calories = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Калории")
    image = models.ImageField(upload_to='dishes/', verbose_name="Изображение", blank=True, null=True)
    is_available = models.BooleanField(default=True, verbose_name="Доступно")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Блюдо"
        verbose_name_plural = "Блюда"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name