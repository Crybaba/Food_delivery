from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, OrderStatus

class OrderItemInline(admin.TabularInline):
    """Инлайн для позиций заказа"""
    model = OrderItem
    extra = 0
    readonly_fields = ['price', 'get_total']
    fields = ['dish', 'quantity', 'price', 'get_total']
    
    def get_total(self, obj):
        """Отображение общей стоимости позиции"""
        if obj.pk:
            return f"{obj.get_total():.2f} ₽"
        return "-"
    get_total.short_description = "Сумма"

@admin.register(OrderStatus)
class OrderStatusAdmin(admin.ModelAdmin):
    """Административный интерфейс для статусов заказов"""
    
    list_display = ['name', 'is_final', 'color_display']
    list_filter = ['is_final']
    search_fields = ['name', 'description']
    
    def color_display(self, obj):
        """Отображение цвета статуса"""
        return format_html(
            '<span style="color: {}; font-weight: bold;">●</span> {}',
            obj.color,
            obj.color
        )
    color_display.short_description = "Цвет"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Административный интерфейс для заказов"""
    
    list_display = [
        'id', 'user_name', 'status', 'total_amount', 
        'payment_method', 'created_at', 'delivered_at'
    ]
    list_filter = [
        'status', 'payment_method', 'created_at', 
        'delivered_at', 'user__role'
    ]
    search_fields = [
        'user__first_name', 'user__last_name', 'user__phone',
        'delivery_address', 'delivery_phone'
    ]
    readonly_fields = [
        'id', 'total_amount', 'created_at', 'updated_at'
    ]
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('id', 'user', 'status', 'total_amount')
        }),
        ('Доставка', {
            'fields': ('delivery_address', 'delivery_phone', 'delivery_notes')
        }),
        ('Оплата', {
            'fields': ('payment_method',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at', 'delivered_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_name(self, obj):
        """Отображение имени пользователя"""
        return f"{obj.user.first_name} {obj.user.last_name} ({obj.user.phone})"
    user_name.short_description = "Пользователь"
    
    def get_queryset(self, request):
        """Оптимизация запросов"""
        return super().get_queryset(request).select_related(
            'user', 'status'
        ).prefetch_related('orderitem_set__dish')
    
    def save_model(self, request, obj, form, change):
        """Сохранение модели с пересчетом суммы"""
        super().save_model(request, obj, form, change)
        if change:  # Если это обновление
            obj.calculate_total()

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Административный интерфейс для позиций заказа"""
    
    list_display = [
        'order', 'dish', 'quantity', 'price', 'get_total'
    ]
    list_filter = ['order__status', 'dish']
    search_fields = [
        'order__id', 'dish__name', 'order__user__first_name',
        'order__user__last_name'
    ]
    readonly_fields = ['get_total']
    
    def get_total(self, obj):
        """Отображение общей стоимости позиции"""
        return f"{obj.get_total():.2f} ₽"
    get_total.short_description = "Сумма"
    
    def get_queryset(self, request):
        """Оптимизация запросов"""
        return super().get_queryset(request).select_related(
            'order', 'dish', 'order__user'
        )
