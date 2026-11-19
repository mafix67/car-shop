from django.db import models

class Orders(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('order', 'заказ'),
        ('test_drive', 'тест-драйв'),
    ]

    STATUS_TYPE_CHOICES = [
        ('new', 'новый'),
        ('in_progress', 'в процессе'),
        ('done', 'сделано'),
        ('canceled', 'не сделано'),
    ]

    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='order')
    car = models.ForeignKey('cars.Car', on_delete=models.CASCADE, related_name='orders')
    customer_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    preferred_date = models.DateField(null=True, blank=True)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_TYPE_CHOICES, default='Нет значения')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status', 'request_type']),
        ]

    def __str__(self):
        return f'{self.get_request_type_display()} — {self.car} ({self.customer_name})'