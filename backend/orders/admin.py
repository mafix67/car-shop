from django.contrib import admin
from django.utils.html import format_html
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'car_info',
        'user',
        'phone',
        'payment_type',
        'payment_method',
        'formatted_amount',
        'status_badge',
        'transaction_id',
        'created_at',
    )
    list_display_links = ('id', 'car_info')
    list_filter = ('status', 'payment_type', 'payment_method', 'created_at')
    search_fields = (
        'id',
        'phone',
        'transaction_id',
        'user__username',
        'user__email',
        'car__brand',
        'car__model',
    )
    readonly_fields = ('transaction_id', 'created_at', 'updated_at')
    list_select_related = ('user', 'car')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    actions = ('mark_as_deposit_paid', 'mark_as_paid', 'mark_as_cancelled')

    fieldsets = (
        ('Клиент и автомобиль', {
            'fields': ('user', 'phone', 'car'),
        }),
        ('Оплата и статус', {
            'fields': ('status', 'payment_type', 'payment_method', 'amount', 'transaction_id'),
        }),
        ('Служебная информация', {
            'fields': ('created_at', 'updated_at'),
        }),
    )

    @admin.display(description='Автомобиль', ordering='car__brand')
    def car_info(self, obj):
        return f'{obj.car.brand} {obj.car.model} ({obj.car.year})'

    @admin.display(description='Сумма', ordering='amount')
    def formatted_amount(self, obj):
        amount_str = f'{obj.amount:,.0f}'.replace(',', ' ')
        return f'{amount_str} ₽'

    @admin.display(description='Статус', ordering='status')
    def status_badge(self, obj):
        colors = {
            Order.Status.PENDING: ('#fef3c7', '#92400e'),
            Order.Status.DEPOSIT_PAID: ('#dbeafe', '#1e40af'),
            Order.Status.PAID: ('#d1fae5', '#065f46'),
            Order.Status.CANCELLED: ('#f3f4f6', '#4b5563'),
        }
        bg, fg = colors.get(obj.status, ('#f3f4f6', '#111827'))
        return format_html(
            '<span style="background:{}; color:{}; padding:4px 10px; '
            'border-radius:999px; font-weight:600; font-size:12px;">{}</span>',
            bg,
            fg,
            obj.get_status_display(),
        )

    @admin.action(description='Перевести в статус «Внесена предоплата (бронь)»')
    def mark_as_deposit_paid(self, request, queryset):
        updated = queryset.update(status=Order.Status.DEPOSIT_PAID)
        self.message_user(request, f'Обновлено заказов: {updated}.')

    @admin.action(description='Перевести в статус «Оплачен полностью»')
    def mark_as_paid(self, request, queryset):
        updated = queryset.update(status=Order.Status.PAID)
        self.message_user(request, f'Обновлено заказов: {updated}.')

    @admin.action(description='Отменить выбранные заказы')
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status=Order.Status.CANCELLED)
        self.message_user(request, f'Отменено заказов: {updated}.')