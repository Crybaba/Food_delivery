from django.db import models

class Dish(models.Model):
    CATEGORY_CHOICES = [
        ('hot', 'Горячее'),
        ('japan', 'Япония'),
        ('china', 'Китай'),
        ('snack', 'Закуски'),
        ('drink', 'Напитки'),
        ('dessert', 'Десерты'),
        ('other', 'Другое'),
    ]

    name = models.CharField(max_length=100, verbose_name="Название блюда")
    description = models.TextField(verbose_name="Описание")
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Цена")
    weight = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Вес (г)")
    calories = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Калории")
    image = models.ImageField(upload_to='dishes/', verbose_name="Изображение", blank=True, null=True)
    is_available = models.BooleanField(default=True, verbose_name="Доступно")

from django.db import models

class Dish(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название блюда")
    description = models.TextField(verbose_name="Описание")
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Цена")
    weight = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Вес (г)")
    calories = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Калории")
    image = models.ImageField(upload_to='dishes/', verbose_name="Изображение", blank=True, null=True)
    is_available = models.BooleanField(default=True, verbose_name="Доступно")

    category = models.CharField(
        max_length=50,        # можно увеличить, если планируются длинные названия
        default='other',
        verbose_name="Категория"
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Блюдо"
        verbose_name_plural = "Блюда"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Блюдо"
        verbose_name_plural = "Блюда"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
