import os
from pathlib import Path

from django.core.management.base import BaseCommand
from menu.models import Dish


class Command(BaseCommand):
    help = "Создаёт тестовые азиатские блюда (30–40 позиций) для разработки"

    def handle(self, *args, **options):
        menu = [
            # 🇯🇵 Япония
            {"name": "Рамен с курицей", "category": "japan", "description": "Классический японский рамен с курицей, яйцом и лапшой удон", "price": 520, "weight": 400, "calories": 540},
            {"name": "Рамен Тонкоцу", "category": "japan", "description": "Плотный свиной бульон, лапша, маринованное яйцо и чаша умами", "price": 640, "weight": 420, "calories": 610},
            {"name": "Суши Филадельфия", "category": "japan", "description": "Ролл с лососем, сливочным сыром и рисом", "price": 490, "weight": 200, "calories": 450},
            {"name": "Суши Калифорния", "category": "japan", "description": "Ролл с крабом, авокадо и икрой тобико", "price": 470, "weight": 190, "calories": 420},
            {"name": "Суши Унаги", "category": "japan", "description": "Ролл с копчёным угрём и сладким соусом унаги", "price": 530, "weight": 200, "calories": 480},
            {"name": "Терияки с курицей", "category": "japan", "description": "Куриное филе, обжаренное в соусе терияки, с кунжутом и рисом", "price": 450, "weight": 350, "calories": 590},
            {"name": "Терияки с лососем", "category": "japan", "description": "Лосось на гриле в соусе терияки, подаётся с овощами и рисом", "price": 690, "weight": 380, "calories": 640},
            {"name": "Гёдза со свининой", "category": "japan", "description": "Обжаренные японские пельмени с начинкой из свинины и капусты", "price": 390, "weight": 250, "calories": 430},
            {"name": "Якитори", "category": "japan", "description": "Шашлычки из курицы на углях с соусом", "price": 350, "weight": 220, "calories": 370},
            {"name": "Онигири с тунцом", "category": "japan", "description": "Рисовый треугольник с начинкой из тунца и майонеза", "price": 220, "weight": 160, "calories": 290},

            # 🇨🇳 Китай
            {"name": "Лапша с говядиной по-китайски", "category": "china", "description": "Жареная лапша с говядиной, овощами и соевым соусом", "price": 520, "weight": 400, "calories": 560},
            {"name": "Курица в кисло-сладком соусе", "category": "china", "description": "Хрустящие кусочки курицы в ананасно-томатном соусе", "price": 490, "weight": 370, "calories": 540},
            {"name": "Димсам с креветками", "category": "china", "description": "Паровые китайские пельмени с креветками", "price": 410, "weight": 220, "calories": 310},
            {"name": "Бао с уткой", "category": "china", "description": "Пышная булочка с уткой по-пекински, огурцом и соусом хоисин", "price": 450, "weight": 180, "calories": 360},
            {"name": "Жареный рис с яйцом", "category": "china", "description": "Обжаренный рис с яйцом, луком и соевым соусом", "price": 330, "weight": 300, "calories": 430},
            {"name": "Суп Вонтон", "category": "china", "description": "Бульон с пельмешками вонтон и зеленью", "price": 420, "weight": 350, "calories": 410},
            {"name": "Говядина с брокколи", "category": "china", "description": "Тонко нарезанная говядина с брокколи и чесночным соусом", "price": 560, "weight": 380, "calories": 590},

            # 🇹🇭 Таиланд
            {"name": "Том Ям", "category": "thai", "description": "Острый тайский суп с креветками, лемонграссом и кокосом", "price": 590, "weight": 350, "calories": 440},
            {"name": "Пад Тай с креветками", "category": "thai", "description": "Жареная лапша с яйцом, арахисом, соусом тамаринд и креветками", "price": 530, "weight": 400, "calories": 570},
            {"name": "Карри Масаман", "category": "thai", "description": "Тайское карри с картофелем, арахисом и курицей", "price": 560, "weight": 380, "calories": 600},
            {"name": "Карри Зелёное", "category": "thai", "description": "Пряное карри с кокосовым молоком и овощами", "price": 540, "weight": 360, "calories": 520},
            {"name": "Салат Сом Там", "category": "thai", "description": "Тайский салат из зелёной папайи с орехами и лаймом", "price": 420, "weight": 250, "calories": 240},

            # 🇰🇷 Корея
            {"name": "Бибимбап", "category": "korea", "description": "Тёплое блюдо из риса, овощей, говядины и острого соуса кочудян", "price": 580, "weight": 420, "calories": 610},
            {"name": "Кимчи", "category": "korea", "description": "Острая ферментированная капуста по-корейски", "price": 290, "weight": 150, "calories": 120},
            {"name": "Кимчи-чиге", "category": "korea", "description": "Острый суп из кимчи, тофу и свинины", "price": 520, "weight": 380, "calories": 490},
            {"name": "Ттокпокки", "category": "korea", "description": "Острые рисовые клёцки в соусе из перца кочудян", "price": 460, "weight": 300, "calories": 480},
            {"name": "Курица Яннюм", "category": "korea", "description": "Жареные кусочки курицы в сладко-остром соусе", "price": 520, "weight": 350, "calories": 560},

            # 🇻🇳 Вьетнам
            {"name": "Фо Бо", "category": "vietnam", "description": "Вьетнамский суп с рисовой лапшой, говядиной и зеленью", "price": 560, "weight": 400, "calories": 450},
            {"name": "Фо Га", "category": "vietnam", "description": "Суп Фо с курицей и рисовой лапшой", "price": 510, "weight": 380, "calories": 410},
            {"name": "Бань Ми", "category": "vietnam", "description": "Вьетнамский сэндвич с мясом, морковью и соусом", "price": 370, "weight": 250, "calories": 420},
            {"name": "Роллы Нем", "category": "vietnam", "description": "Обжаренные спринг-роллы с овощами и свининой", "price": 410, "weight": 220, "calories": 390},
            {"name": "Свежие спринг-роллы", "category": "vietnam", "description": "Рисовая бумага с овощами, креветками и арахисовым соусом", "price": 390, "weight": 200, "calories": 310},

            # 🇮🇩 🇲🇾 Остальная Азия
            {"name": "Наси Горенг", "category": "asia", "description": "Индонезийский жареный рис с яйцом и курицей", "price": 490, "weight": 380, "calories": 560},
            {"name": "Ми Горенг", "category": "asia", "description": "Индонезийская жареная лапша с овощами и яйцом", "price": 470, "weight": 360, "calories": 520},
            {"name": "Сатэй с арахисовым соусом", "category": "asia", "description": "Шашлычки из курицы с ароматным соусом из арахиса", "price": 450, "weight": 300, "calories": 510},
            {"name": "Лакса", "category": "asia", "description": "Малайзийский суп с лапшой, кокосовым молоком и морепродуктами", "price": 590, "weight": 400, "calories": 580},
            {"name": "Курица с ананасом по-азиатски", "category": "asia", "description": "Обжаренные кусочки курицы с ананасом и сладким соусом", "price": 460, "weight": 350, "calories": 500},
        ]

        created_count = 0
        for item in menu:
            dish, created = Dish.objects.get_or_create(
                name=item["name"],
                defaults={
                    "description": item["description"],
                    "price": item["price"],
                    "weight": item["weight"],
                    "calories": item["calories"],
                    "category": item["category"],
                    "is_available": True,
                },
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Создано блюд: {created_count}. Всего в БД: {Dish.objects.count()}"
        ))
