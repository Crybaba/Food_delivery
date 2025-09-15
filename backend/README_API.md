# API для системы доставки еды

## Обзор

Система предоставляет REST API для управления блюдами и заказами в приложении доставки еды.

## Структура API

### Блюда (Menu API)
- **Базовый URL**: `http://localhost:8000/menu/api/`
- **Документация**: [API_EXAMPLES.md](API_EXAMPLES.md)

### Заказы (Orders API)
- **Базовый URL**: `http://localhost:8000/api/`
- **Документация**: [ORDERS_API_EXAMPLES.md](ORDERS_API_EXAMPLES.md)

## Быстрый старт

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка базы данных

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Создание суперпользователя

```bash
python manage.py createsuperuser
```

### 4. Инициализация данных

```bash
# Создание статусов заказов
python manage.py init_order_statuses

# Загрузка тестовых данных (опционально)
python manage.py loaddata orders/fixtures/initial_data.json
```

### 5. Запуск сервера

```bash
python manage.py runserver
```

## Основные эндпоинты

### Блюда
- `GET /menu/api/dishes/` - Список блюд
- `POST /menu/api/dishes/` - Создание блюда
- `GET /menu/api/dishes/{id}/` - Получение блюда
- `PUT /menu/api/dishes/{id}/` - Обновление блюда
- `DELETE /menu/api/dishes/{id}/` - Удаление блюда

### Заказы
- `GET /api/orders/` - Список заказов
- `POST /api/orders/` - Создание заказа
- `GET /api/orders/{id}/` - Получение заказа
- `PUT /api/orders/{id}/` - Обновление заказа
- `DELETE /api/orders/{id}/` - Удаление заказа

### Статусы заказов
- `GET /api/order-statuses/` - Список статусов
- `GET /api/order-statuses/{id}/` - Получение статуса

## Аутентификация

API использует Token Authentication. Для получения токена:

```bash
# Создание токена для пользователя
python manage.py drf_create_token username
```

Или через API:

```http
POST /api/auth/token/
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}
```

## Примеры использования

### Создание заказа

```bash
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token your_token_here" \
  -d '{
    "payment_method": "card",
    "delivery_address": "ул. Пушкина, д. 10, кв. 5",
    "delivery_phone": "79123456789",
    "items": [
      {
        "dish_id": 1,
        "quantity": 2
      }
    ]
  }'
```

### Получение списка блюд

```bash
curl -X GET http://localhost:8000/menu/api/dishes/ \
  -H "Authorization: Token your_token_here"
```

## Административный интерфейс

Доступен по адресу: `http://localhost:8000/admin/`

Включает управление:
- Блюдами и их характеристиками
- Заказами и позициями
- Статусами заказов
- Пользователями и ролями

## Фильтрация и поиск

### Блюда
- `?search=пицца` - поиск по названию и описанию
- `?is_available=true` - фильтр по доступности
- `?ordering=price` - сортировка по цене

### Заказы
- `?status=1` - фильтр по статусу
- `?payment_method=card` - фильтр по способу оплаты
- `?search=Пушкина` - поиск по адресу
- `?ordering=-created_at` - сортировка по дате

## Пагинация

Все списки поддерживают пагинацию:
- `?page=1` - номер страницы
- По умолчанию: 20 элементов на страницу

## Коды ответов

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан
- `204 No Content` - Ресурс удален
- `400 Bad Request` - Ошибка валидации
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Недостаточно прав
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Ошибка сервера

## Разработка

### Структура проекта

```
backend/
├── accounts/          # Пользователи и аутентификация
├── menu/             # Блюда и меню
├── orders/           # Заказы и статусы
├── backend/          # Настройки Django
└── requirements.txt  # Зависимости
```

### Тестирование

```bash
# Запуск тестов
python manage.py test

# Тесты конкретного приложения
python manage.py test menu
python manage.py test orders
```

### Миграции

```bash
# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Откат миграций
python manage.py migrate app_name zero
```

## Безопасность

- Все операции с заказами требуют аутентификации
- Пользователи видят только свои заказы
- Администраторы имеют полный доступ
- Валидация всех входных данных
- Защита от CSRF атак

## Производительность

- Оптимизированные запросы с `select_related` и `prefetch_related`
- Пагинация для больших списков
- Индексы в базе данных
- Кэширование статусов заказов

## Мониторинг

- Логирование всех операций
- Отслеживание ошибок
- Метрики производительности
- Административные уведомления
