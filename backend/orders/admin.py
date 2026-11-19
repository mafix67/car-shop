from django.contrib import admin
from .models import Orders


@admin.register(Orders)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'request_type',
        'car',
        'customer_name',
        'phone',
        'preferred_date',
        'status',
        'created_at',
    )
    list_filter = ('request_type', 'created_at', 'status')
    search_fields = ('customer_name', 'phone', 'car__brand', 'car__model')
    list_editable = ('status',)
    ordering = ('-created_at',)