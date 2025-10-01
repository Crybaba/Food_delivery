from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Создаёт тестовых пользователей для разработки"

    def handle(self, *args, **options):
        test_users = [
            {"phone": "9000000001", "password": "12345", "role": "USER", "name": "Иван", "surname": "Пользователь"},
            {"phone": "9000000002", "password": "12345", "role": "COURIER", "name": "Пётр", "surname": "Курьер"},
            {"phone": "9000000003", "password": "12345", "role": "ADMIN", "name": "Админ", "surname": "Супер"},
        ]

        for data in test_users:
            if not User.objects.filter(phone=data["phone"]).exists():
                user = User.objects.create_user(
                    phone=data["phone"],
                    password=data["password"],
                    role=data["role"],
                    name=data["name"],
                    surname=data["surname"],
                )
                self.stdout.write(self.style.SUCCESS(f"Создан пользователь: {user}"))
            else:
                self.stdout.write(f"Пользователь {data['phone']} уже есть")

        # суперюзер для полного доступа в Django
        if not User.objects.filter(phone="9000000000").exists():
            User.objects.create_superuser(phone="9000000000", password="admin123", role="ADMIN")
            self.stdout.write(self.style.SUCCESS("Создан суперюзер 9000000000 / admin123"))
