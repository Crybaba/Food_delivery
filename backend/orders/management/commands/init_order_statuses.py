from django.core.management.base import BaseCommand
from orders.models import OrderStatus

class Command(BaseCommand):
    help = 'Создает базовые статусы заказов'

    def handle(self, *args, **options):
        statuses = [
            {
                'name': 'Новый',
                'description': 'Заказ только что создан',
                'is_final': False,
                'color': '#007bff'
            },
            {
                'name': 'В обработке',
                'description': 'Заказ принят и обрабатывается',
                'is_final': False,
                'color': '#ffc107'
            },
            {
                'name': 'Готовится',
                'description': 'Заказ готовится',
                'is_final': False,
                'color': '#17a2b8'
            },
            {
                'name': 'В пути',
                'description': 'Заказ в пути к клиенту',
                'is_final': False,
                'color': '#6f42c1'
            },
            {
                'name': 'Доставлен',
                'description': 'Заказ успешно доставлен',
                'is_final': True,
                'color': '#28a745'
            },
            {
                'name': 'Отменен',
                'description': 'Заказ отменен',
                'is_final': True,
                'color': '#dc3545'
            }
        ]

        created_count = 0
        for status_data in statuses:
            status, created = OrderStatus.objects.get_or_create(
                name=status_data['name'],
                defaults=status_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создан статус: {status.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Статус уже существует: {status.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Создано {created_count} новых статусов заказов')
        )
