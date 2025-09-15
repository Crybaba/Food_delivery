# API для управления блюдами

## Базовый URL
```
http://localhost:8000/menu/api/
```

## Эндпоинты

### 1. Получение списка всех блюд
```http
GET /menu/api/dishes/
```

**Параметры запроса:**
- `search` - поиск по названию и описанию
- `is_available` - фильтр по доступности (true/false)
- `ordering` - сортировка (name, price, created_at, calories)
- `page` - номер страницы (пагинация)

**Пример:**
```http
GET /menu/api/dishes/?search=пицца&is_available=true&ordering=price
```

### 2. Получение конкретного блюда
```http
GET /menu/api/dishes/{id}/
```

### 3. Создание нового блюда
```http
POST /menu/api/dishes/
Content-Type: application/json

{
    "name": "Маргарита",
    "description": "Классическая пицца с томатами и моцареллой",
    "price": "450.00",
    "weight": "350.00",
    "calories": "280.00",
    "is_available": true
}
```

### 4. Обновление блюда (полное)
```http
PUT /menu/api/dishes/{id}/
Content-Type: application/json

{
    "name": "Маргарита Премиум",
    "description": "Улучшенная версия классической пиццы",
    "price": "550.00",
    "weight": "400.00",
    "calories": "320.00",
    "is_available": true
}
```

### 5. Частичное обновление блюда
```http
PATCH /menu/api/dishes/{id}/
Content-Type: application/json

{
    "price": "500.00",
    "is_available": false
}
```

### 6. Удаление блюда
```http
DELETE /menu/api/dishes/{id}/
```

### 7. Дополнительные эндпоинты

#### Получение только доступных блюд
```http
GET /menu/api/dishes/available/
```

#### Получение только недоступных блюд
```http
GET /menu/api/dishes/unavailable/
```

#### Переключение доступности блюда
```http
POST /menu/api/dishes/{id}/toggle_availability/
```

## Примеры ответов

### Успешное создание блюда (201 Created)
```json
{
    "id": 1,
    "name": "Маргарита",
    "description": "Классическая пицца с томатами и моцареллой",
    "price": "450.00",
    "weight": "350.00",
    "calories": "280.00",
    "image": null,
    "is_available": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

### Список блюд с пагинацией (200 OK)
```json
{
    "count": 25,
    "next": "http://localhost:8000/menu/api/dishes/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Маргарита",
            "description": "Классическая пицца с томатами и моцареллой",
            "price": "450.00",
            "weight": "350.00",
            "calories": "280.00",
            "image": null,
            "is_available": true,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

### Ошибка валидации (400 Bad Request)
```json
{
    "name": ["Название должно содержать минимум 2 символа"],
    "price": ["Цена должна быть больше 0"]
}
```

## Коды ответов

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс успешно создан
- `204 No Content` - Ресурс успешно удален
- `400 Bad Request` - Ошибка валидации данных
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Недостаточно прав
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Аутентификация

Для создания, обновления и удаления блюд требуется аутентификация. Можно использовать:
- Session Authentication (для веб-интерфейса)
- Token Authentication (для API клиентов)

## Загрузка изображений

Для загрузки изображений используйте `multipart/form-data`:

```http
POST /menu/api/dishes/
Content-Type: multipart/form-data

name: Маргарита
description: Классическая пицца
price: 450.00
weight: 350.00
calories: 280.00
image: [файл изображения]
```
