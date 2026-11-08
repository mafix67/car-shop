from django.contrib import admin
from .models import Car

from django.contrib import admin
from .models import Car


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):

    list_display = (
        'brand',
        'model',
        'year',
        'price',
        'mileage',
        'body_type',
        'is_new',
    )

    list_filter = (
        'brand',
        'year',
        'body_type',
        'is_new',
    )

    search_fields = (
        'brand',
        'model',
    )
