from django.contrib import admin
from .models import Dish

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    """Административный интерфейс для модели Dish"""
    
    list_display = [
        'name', 'price', 'weight', 'calories', 
        'is_available', 'created_at'
    ]
    list_filter = ['is_available', 'created_at', 'updated_at']
    search_fields = ['name', 'description']
    list_editable = ['is_available']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'description', 'image')
        }),
        ('Характеристики', {
            'fields': ('price', 'weight', 'calories')
        }),
        ('Статус', {
            'fields': ('is_available',)
        }),
        ('Метаданные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Оптимизация запросов"""
        return super().get_queryset(request).select_related()
