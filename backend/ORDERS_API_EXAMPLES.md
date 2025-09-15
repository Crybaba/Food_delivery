# API для управления заказами

## Базовый URL
```
http://localhost:8000/api/
```

## Эндпоинты

### 1. Получение списка всех заказов
```http
GET /api/orders/
```

**Параметры запроса:**
- `status` - фильтр по статусу заказа
- `payment_method` - фильтр по способу оплаты
- `search` - поиск по адресу доставки и телефону
- `ordering` - сортировка (created_at, total_amount, delivered_at)
- `page` - номер страницы (пагинация)

**Пример:**
```http
GET /api/orders/?status=1&payment_method=cash&ordering=-created_at
```

### 2. Получение конкретного заказа
```http
GET /api/orders/{id}/
```

### 3. Создание нового заказа
```http
POST /api/orders/
Content-Type: application/json
Authorization: Token your_token_here

{
    "payment_method": "card",
    "delivery_address": "ул. Пушкина, д. 10, кв. 5",
    "delivery_phone": "79123456789",
    "delivery_notes": "Домофон не работает, звонить на телефон",
    "items": [
        {
            "dish_id": 1,
            "quantity": 2
        },
        {
            "dish_id": 3,
            "quantity": 1
        }
    ]
}
```

### 4. Обновление заказа (полное)
```http
PUT /api/orders/{id}/
Content-Type: application/json
Authorization: Token your_token_here

{
    "status_id": 2,
    "payment_method": "online",
    "delivery_address": "ул. Ленина, д. 15, кв. 8",
    "delivery_phone": "79987654321",
    "delivery_notes": "Оставить у соседей",
    "delivered_at": "2024-01-15T18:30:00Z"
}
```

### 5. Частичное обновление заказа
```http
PATCH /api/orders/{id}/
Content-Type: application/json
Authorization: Token your_token_here

{
    "status_id": 3,
    "delivered_at": "2024-01-15T18:30:00Z"
}
```

### 6. Удаление заказа
```http
DELETE /api/orders/{id}/
Authorization: Token your_token_here
```

### 7. Дополнительные эндпоинты

#### Получение заказов текущего пользователя
```http
GET /api/orders/my_orders/
Authorization: Token your_token_here
```

#### Получение активных заказов
```http
GET /api/orders/active/
Authorization: Token your_token_here
```

#### Получение завершенных заказов
```http
GET /api/orders/completed/
Authorization: Token your_token_here
```

#### Добавление позиции в заказ
```http
POST /api/orders/{id}/add_item/
Content-Type: application/json
Authorization: Token your_token_here

{
    "dish_id": 5,
    "quantity": 3
}
```

#### Удаление позиции из заказа
```http
DELETE /api/orders/{id}/remove_item/
Content-Type: application/json
Authorization: Token your_token_here

{
    "dish_id": 5
}
```

#### Обновление количества позиции
```http
POST /api/orders/{id}/update_item_quantity/
Content-Type: application/json
Authorization: Token your_token_here

{
    "dish_id": 5,
    "quantity": 2
}
```

### 8. Управление статусами заказов

#### Получение списка статусов
```http
GET /api/order-statuses/
Authorization: Token your_token_here
```

#### Получение конкретного статуса
```http
GET /api/order-statuses/{id}/
Authorization: Token your_token_here
```

## Примеры ответов

### Успешное создание заказа (201 Created)
```json
{
    "id": 1,
    "user": 1,
    "user_name": "Иван Петров",
    "status": null,
    "status_id": null,
    "total_amount": "1250.00",
    "payment_method": "card",
    "delivery_address": "ул. Пушкина, д. 10, кв. 5",
    "delivery_phone": "79123456789",
    "delivery_notes": "Домофон не работает, звонить на телефон",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "delivered_at": null,
    "items": [
        {
            "id": 1,
            "dish": {
                "id": 1,
                "name": "Маргарита",
                "description": "Классическая пицца с томатами и моцареллой",
                "price": "450.00",
                "weight": "350.00",
                "calories": "280.00",
                "image": null,
                "is_available": true,
                "created_at": "2024-01-15T09:00:00Z",
                "updated_at": "2024-01-15T09:00:00Z"
            },
            "dish_id": 1,
            "quantity": 2,
            "price": "450.00",
            "total": "900.00"
        },
        {
            "id": 2,
            "dish": {
                "id": 3,
                "name": "Кока-Кола",
                "description": "Газированный напиток",
                "price": "350.00",
                "weight": "500.00",
                "calories": "200.00",
                "image": null,
                "is_available": true,
                "created_at": "2024-01-15T09:00:00Z",
                "updated_at": "2024-01-15T09:00:00Z"
            },
            "dish_id": 3,
            "quantity": 1,
            "price": "350.00",
            "total": "350.00"
        }
    ]
}
```

### Список заказов с пагинацией (200 OK)
```json
{
    "count": 25,
    "next": "http://localhost:8000/api/orders/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "user": 1,
            "user_name": "Иван Петров",
            "status": {
                "id": 2,
                "name": "В обработке",
                "description": "Заказ принят и обрабатывается",
                "is_final": false,
                "color": "#ffc107"
            },
            "status_id": 2,
            "total_amount": "1250.00",
            "payment_method": "card",
            "delivery_address": "ул. Пушкина, д. 10, кв. 5",
            "delivery_phone": "79123456789",
            "delivery_notes": "Домофон не работает, звонить на телефон",
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:35:00Z",
            "delivered_at": null,
            "items": [...]
        }
    ]
}
```

### Статусы заказов (200 OK)
```json
[
    {
        "id": 1,
        "name": "Новый",
        "description": "Заказ только что создан",
        "is_final": false,
        "color": "#007bff"
    },
    {
        "id": 2,
        "name": "В обработке",
        "description": "Заказ принят и обрабатывается",
        "is_final": false,
        "color": "#ffc107"
    },
    {
        "id": 3,
        "name": "Готовится",
        "description": "Заказ готовится",
        "is_final": false,
        "color": "#17a2b8"
    },
    {
        "id": 4,
        "name": "В пути",
        "description": "Заказ в пути к клиенту",
        "is_final": false,
        "color": "#6f42c1"
    },
    {
        "id": 5,
        "name": "Доставлен",
        "description": "Заказ успешно доставлен",
        "is_final": true,
        "color": "#28a745"
    },
    {
        "id": 6,
        "name": "Отменен",
        "description": "Заказ отменен",
        "is_final": true,
        "color": "#dc3545"
    }
]
```

### Ошибка валидации (400 Bad Request)
```json
{
    "delivery_address": ["Адрес доставки должен содержать минимум 10 символов"],
    "delivery_phone": ["Некорректный номер телефона"],
    "items": ["Заказ должен содержать хотя бы одну позицию"]
}
```

### Ошибка доступа (403 Forbidden)
```json
{
    "detail": "У вас нет прав на изменение этого заказа"
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

Для всех операций с заказами требуется аутентификация. Можно использовать:
- Session Authentication (для веб-интерфейса)
- Token Authentication (для API клиентов)

## Права доступа

- **Обычные пользователи** могут:
  - Создавать заказы
  - Просматривать только свои заказы
  - Изменять только свои заказы (если статус не финальный)
  - Удалять только свои заказы (если статус не финальный)

- **Администраторы** могут:
  - Просматривать все заказы
  - Изменять любые заказы
  - Удалять любые заказы (если статус не финальный)
  - Управлять статусами заказов

## Бизнес-логика

1. **Создание заказа**: Автоматически рассчитывается общая сумма на основе позиций
2. **Добавление позиций**: Если блюдо уже есть в заказе, увеличивается количество
3. **Изменение заказа**: Нельзя изменять заказы с финальным статусом
4. **Удаление заказа**: Нельзя удалять заказы с финальным статусом
5. **Статусы**: Финальные статусы (доставлен, отменен) блокируют изменения
