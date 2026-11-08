from django.db import models


class Car(models.Model):
    BODY_TYPE_CHOICES = [
        ('sedan', 'Седан'),
        ('suv', 'Внедорожник'),
        ('hatchback', 'Хэтчбек'),
        ('coupe', 'Купе'),
        ('wagon', 'Универсал'),
    ]

    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mileage = models.PositiveIntegerField(default=0)
    engine = models.CharField(max_length=100)
    transmission = models.CharField(max_length=50)
    body_type = models.CharField(
        max_length=20,
        choices=BODY_TYPE_CHOICES
    )
    image = models.ImageField(upload_to='cars/', blank=True, null=True)
    is_new = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.brand} {self.model} ({self.year})'