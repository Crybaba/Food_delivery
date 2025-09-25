import os
from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.files import File

from menu.models import Dish


class Command(BaseCommand):

    def handle(self, *args, **options):
        # Папка с изображениями (относительно этого файла)
        images_path = Path(__file__).resolve().parent.parent.parent.parent / "media" / "dishes"

        # Пробное меню из 10 блюд
        menu = [
            {"name": "Пицца Маргарита", "description": "Классическая пицца с томатным соусом и моцареллой", "price": 499, "weight": 450, "calories": 980},
            {"name": "Цезарь с курицей", "description": "Салат романо, курица-гриль, соус цезарь, пармезан", "price": 389, "weight": 280, "calories": 520},
            {"name": "Том Ям", "description": "Острый тайский суп с креветками и кокосовым молоком", "price": 590, "weight": 350, "calories": 430},
            {"name": "Бургер Классический", "description": "Говяжья котлета, сыр чеддер, томаты, салат айсберг", "price": 420, "weight": 300, "calories": 780},
            {"name": "Паста Карбонара", "description": "Паста, бекон, сливочный соус, пармезан", "price": 450, "weight": 320, "calories": 860},
            {"name": "Суши Филадельфия", "description": "Рис, лосось, сливочный сыр, нори", "price": 520, "weight": 200, "calories": 450},
            {"name": "Салат Греческий", "description": "Огурцы, помидоры, фета, маслины, оливковое масло", "price": 330, "weight": 250, "calories": 210},
            {"name": "Рамен со свининой", "description": "Японский суп с лапшой, свининой и овощами", "price": 610, "weight": 400, "calories": 520},
            {"name": "Стейк Рибай", "description": "Говяжий стейк с гарниром из овощей", "price": 990, "weight": 350, "calories": 900},
            {"name": "Пицца Пепперони", "description": "Пицца с колбасой пепперони и моцареллой", "price": 520, "weight": 450, "calories": 1050},
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
                    "is_available": True,
                },
            )

            if created:
                created_count += 1

            # Подключаем изображение, если его нет
            if not dish.image:
                image_file = self._match_image_file(images_path, dish.name)
                if image_file:
                    # сохраняем относительный путь для ImageField
                    with open(image_file, "rb") as f:
                        dish.image.save(Path(image_file).name, File(f), save=True)

        self.stdout.write(self.style.SUCCESS(
            f"Seeded trial menu. Created: {created_count}, total dishes: {Dish.objects.count()}"
        ))

    def _match_image_file(self, folder: Path, name: str) -> str | None:
        slug = name.strip().lower().replace(" ", "_")
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            candidate = folder / f"{slug}{ext}"
            if candidate.exists():
                return str(candidate)

        # fallback: первый файл в папке
        for path in folder.glob("*.*"):
            if path.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"):
                return str(path)

        return None
