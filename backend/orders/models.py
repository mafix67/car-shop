from django.conf import settings
from django.db import models


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Ожидает оплаты'
        DEPOSIT_PAID = 'deposit_paid', 'Внесена предоплата (бронь)'
        PAID = 'paid', 'Оплачен полностью'
        CANCELLED = 'cancelled', 'Отменён'

    class PaymentType(models.TextChoices):
        DEPOSIT = 'deposit', 'Предоплата за бронирование'
        FULL = 'full', 'Полная оплата'

    class PaymentMethod(models.TextChoices):
        CARD = 'card', 'Банковская карта'
        SBP = 'sbp', 'СБП'
        CREDIT = 'credit', 'Автокредит'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Покупатель',
    )
    car = models.ForeignKey(
        'cars.Car', 
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Автомобиль',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name='Статус',
    )
    payment_type = models.CharField(
        max_length=20,
        choices=PaymentType.choices,
        default=PaymentType.DEPOSIT,
        verbose_name='Тип оплаты',
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CARD,
        verbose_name='Способ оплаты',
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='Сумма к оплате',
    )
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    transaction_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='ID транзакции',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return f'Заказ #{self.id} — {self.car} ({self.get_status_display()})'