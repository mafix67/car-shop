from decimal import Decimal
from rest_framework import serializers
from cars.models import Car
from .models import Order

BOOKING_DEPOSIT_AMOUNT = Decimal('50000.00')  


class CarShortSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = ('brand', 'model', 'year', 'price', 'image', ' mileage', 'engine',' transmission','body_type' )

    def get_image(self, obj):
        request = self.context.get('request')
        if getattr(obj, 'image', None):
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class OrderSerializer(serializers.ModelSerializer):
    car_details = CarShortSerializer(source='car', read_only=True)
    car_id = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.all(),
        source='car',
        write_only=True,
    )
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_type_display = serializers.CharField(source='get_payment_type_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'car_id',
            'car_details',
            'status',
            'status_display',
            'payment_type',
            'payment_type_display',
            'payment_method',
            'payment_method_display',
            'amount',
            'phone',
            'transaction_id',
            'created_at',
        )
        read_only_fields = ('id', 'status', 'amount', 'transaction_id', 'created_at')

    def create(self, validated_data):
        car = validated_data['car']
        payment_type = validated_data.get('payment_type', Order.PaymentType.DEPOSIT)

        
        if payment_type == Order.PaymentType.DEPOSIT:
            amount = min(BOOKING_DEPOSIT_AMOUNT, car.price)
        else:
            amount = car.price

        validated_data['amount'] = amount
        return super().create(validated_data)


class OrderPaySerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
    sms_code = serializers.RegexField(
        regex=r'^\d{4}$',
        error_messages={'invalid': 'Введите 4-значный код из SMS.'},
    )