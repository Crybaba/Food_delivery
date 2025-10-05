import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from orders.models import Order, OrderItem
from menu.models import Dish

User = get_user_model()

class Command(BaseCommand):
    help = "Fill database with 60 random orders for testing"

    def handle(self, *args, **kwargs):
        users = list(User.objects.filter(role='USER', is_active=True))
        couriers = list(User.objects.filter(role='COURIER', is_active=True))
        if not couriers:
            self.stdout.write(self.style.WARNING("No active couriers found!"))
        dishes = list(Dish.objects.all())
        statuses = ['processing', 'preparing', 'delivering', 'completed']
        payments = ['cash', 'card']

        start_date = datetime(2025, 8, 25)
        end_date = datetime(2025, 10, 6)
        delta_days = (end_date - start_date).days

        for i in range(60):
            user = random.choice(users)
            courier = random.choice(couriers) if random.random() < 0.8 and couriers else None

            pickup = random.choice([True, False])
            persons = 1 if pickup else random.randint(1, 5)
            street = house = entrance = flat = intercom = None
            phone = user.phone
            comment = random.choice(['', 'Пожарьте хорошо', 'Без лука', 'Острый', 'Быстро, пожалуйста'])
            payment = random.choice(payments)
            status = random.choice(statuses)

            if not pickup:
                street = random.choice(['Ленина', 'Пушкина', 'Гагарина', 'Советская', 'Мира'])
                house = str(random.randint(1, 100))
                entrance = str(random.randint(1, 10))
                flat = str(random.randint(1, 200))
                intercom = str(random.randint(100, 999))

            # Случайная дата между start_date и end_date
            random_day = random.randint(0, delta_days)
            random_second = random.randint(0, 86399)
            created_at = timezone.make_aware(start_date + timedelta(days=random_day, seconds=random_second))
            updated_at = created_at + timedelta(seconds=random.randint(0, 10800))

            # Создаём заказ без даты
            order = Order.objects.create(
                user=user,
                pickup=pickup,
                street=street,
                house=house,
                entrance=entrance,
                flat=flat,
                intercom=intercom,
                phone=phone,
                persons=persons,
                comment=comment,
                payment=payment,
                courier=courier,
                status=status
            )

            # Обновляем даты после создания
            Order.objects.filter(id=order.id).update(created_at=created_at, updated_at=updated_at)

            # Добавляем блюда
            order_dishes = random.sample(dishes, k=random.randint(3, 7))
            for dish in order_dishes:
                quantity = random.randint(1, 3)
                OrderItem.objects.create(order=order, dish=dish, quantity=quantity)

        self.stdout.write(self.style.SUCCESS('Successfully created 60 random orders with couriers and random dates.'))
