from django.db import models

class Dish(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2) 
    weight = models.DecimalField(max_digits=6, decimal_places=2) 
    calories = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='dishes/')