from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = "Создаёт тестовых пользователей для разработки (30 users + 5 couriers + superuser)"

    def handle(self, *args, **options):
        # Список тестовых пользователей: 30 обычных + 5 курьеров
        # Формат: phone, password, role, name, surname
        test_users = [
            # 30 обычных пользователей
            {"phone": "9000000010", "password": "test1234", "role": "USER", "name": "Иван", "surname": "Иванов"},
            {"phone": "9000000011", "password": "test1234", "role": "USER", "name": "Алексей", "surname": "Петров"},
            {"phone": "9000000012", "password": "test1234", "role": "USER", "name": "Мария", "surname": "Смирнова"},
            {"phone": "9000000013", "password": "test1234", "role": "USER", "name": "Анна", "surname": "Кузнецова"},
            {"phone": "9000000014", "password": "test1234", "role": "USER", "name": "Дмитрий", "surname": "Соколов"},
            {"phone": "9000000015", "password": "test1234", "role": "USER", "name": "Екатерина", "surname": "Попова"},
            {"phone": "9000000016", "password": "test1234", "role": "USER", "name": "Никита", "surname": "Лебедев"},
            {"phone": "9000000017", "password": "test1234", "role": "USER", "name": "Ольга", "surname": "Козлова"},
            {"phone": "9000000018", "password": "test1234", "role": "USER", "name": "Сергей", "surname": "Новиков"},
            {"phone": "9000000019", "password": "test1234", "role": "USER", "name": "Виктория", "surname": "Морозова"},
            {"phone": "9000000020", "password": "test1234", "role": "USER", "name": "Роман", "surname": "Волков"},
            {"phone": "9000000021", "password": "test1234", "role": "USER", "name": "Ксения", "surname": "Алексеева"},
            {"phone": "9000000022", "password": "test1234", "role": "USER", "name": "Максим", "surname": "Лазарев"},
            {"phone": "9000000023", "password": "test1234", "role": "USER", "name": "Татьяна", "surname": "Григорьева"},
            {"phone": "9000000024", "password": "test1234", "role": "USER", "name": "Игорь", "surname": "Мартынов"},
            {"phone": "9000000025", "password": "test1234", "role": "USER", "name": "Полина", "surname": "Егорова"},
            {"phone": "9000000026", "password": "test1234", "role": "USER", "name": "Владимир", "surname": "Носков"},
            {"phone": "9000000027", "password": "test1234", "role": "USER", "name": "Алина", "surname": "Федорова"},
            {"phone": "9000000028", "password": "test1234", "role": "USER", "name": "Юрий", "surname": "Богданов"},
            {"phone": "9000000029", "password": "test1234", "role": "USER", "name": "Марина", "surname": "Степанова"},
            {"phone": "9000000030", "password": "test1234", "role": "USER", "name": "Григорий", "surname": "Соловьёв"},
            {"phone": "9000000031", "password": "test1234", "role": "USER", "name": "Наталья", "surname": "Крылова"},
            {"phone": "9000000032", "password": "test1234", "role": "USER", "name": "Андрей", "surname": "Данилов"},
            {"phone": "9000000033", "password": "test1234", "role": "USER", "name": "Вероника", "surname": "Киселева"},
            {"phone": "9000000034", "password": "test1234", "role": "USER", "name": "Степан", "surname": "Макаров"},
            {"phone": "9000000035", "password": "test1234", "role": "USER", "name": "Людмила", "surname": "Кондратьева"},
            {"phone": "9000000036", "password": "test1234", "role": "USER", "name": "Павел", "surname": "Орлов"},
            {"phone": "9000000037", "password": "test1234", "role": "USER", "name": "Александра", "surname": "Тимофеева"},
            {"phone": "9000000038", "password": "test1234", "role": "USER", "name": "Станислав", "surname": "Павлов"},
            {"phone": "9000000039", "password": "test1234", "role": "USER", "name": "Елена", "surname": "Петухова"},

            # 5 курьеров
            {"phone": "9000000040", "password": "courier123", "role": "COURIER", "name": "Пётр", "surname": "Курьянов"},
            {"phone": "9000000041", "password": "courier123", "role": "COURIER", "name": "Илья", "surname": "Сидоров"},
            {"phone": "9000000042", "password": "courier123", "role": "COURIER", "name": "Олег", "surname": "Рябов"},
            {"phone": "9000000043", "password": "courier123", "role": "COURIER", "name": "Николай", "surname": "Гусев"},
            {"phone": "9000000044", "password": "courier123", "role": "COURIER", "name": "Роман", "surname": "Дмитриев"},
        ]

        created = 0
        for data in test_users:
            phone = data["phone"]
            if User.objects.filter(phone=phone).exists():
                self.stdout.write(f"Пользователь с телефоном {phone} уже существует — пропускаю.")
                continue

            # create_user должен уметь принимать role, name, surname как в твоей модели
            try:
                user = User.objects.create_user(
                    phone=data["phone"],
                    password=data["password"],
                    role=data["role"],
                    name=data.get("name", ""),
                    surname=data.get("surname", ""),
                )
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Создан пользователь: {phone} ({data['role']})"))
            except TypeError:
                # На случай, если create_user имеет другой сигнатурный набор аргументов
                # Попробуем более низкоуровневый create
                user = User.objects.create(
                    phone=data["phone"],
                    role=data["role"],
                    name=data.get("name", ""),
                    surname=data.get("surname", ""),
                )
                user.set_password(data["password"])
                user.save()
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Создан пользователь (fallback): {phone} ({data['role']})"))

        # Создаём суперюзера, если нет
        super_phone = "9000000000"
        if not User.objects.filter(phone=super_phone).exists():
            try:
                User.objects.create_superuser(phone=super_phone, password="admin123", role="ADMIN")
            except TypeError:
                # fallback: создать вручную со всеми правами
                su = User.objects.create(phone=super_phone, role="ADMIN", name="Супер", surname="Пользователь")
                su.set_password("admin123")
                su.is_staff = True
                su.is_superuser = True
                su.save()
            self.stdout.write(self.style.SUCCESS(f"Создан суперюзер {super_phone} / admin123"))
        else:
            self.stdout.write(f"Суперюзер {super_phone} уже существует — пропускаю.")

        self.stdout.write(self.style.SUCCESS(f"Готово. Создано новых пользователей: {created}"))
