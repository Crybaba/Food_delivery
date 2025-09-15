from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DishViewSet

# Создаем роутер для ViewSet
router = DefaultRouter()
router.register(r'dishes', DishViewSet, basename='dish')

urlpatterns = [
    path('api/', include(router.urls)),
]
