from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Dish
from .serializers import DishSerializer, DishCreateSerializer, DishUpdateSerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_available', 'category']  # добавили category
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at', 'calories']
    ordering = ['-created_at']

    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'create':
            return DishCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DishUpdateSerializer
        return DishSerializer
    
    def create(self, request, *args, **kwargs):
        """Создание нового блюда"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dish = serializer.save()
        
        # Возвращаем созданное блюдо с полным сериализатором
        response_serializer = DishSerializer(dish)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Обновление блюда"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        dish = serializer.save()
        
        # Возвращаем обновленное блюдо с полным сериализатором
        response_serializer = DishSerializer(dish)
        return Response(response_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Удаление блюда"""
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        """Переключение доступности блюда"""
        dish = self.get_object()
        dish.is_available = not dish.is_available
        dish.save()
        
        serializer = self.get_serializer(dish)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Получение только доступных блюд"""
        available_dishes = self.queryset.filter(is_available=True)
        serializer = self.get_serializer(available_dishes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unavailable(self, request):
        """Получение только недоступных блюд"""
        unavailable_dishes = self.queryset.filter(is_available=False)
        serializer = self.get_serializer(unavailable_dishes, many=True)
        return Response(serializer.data)
