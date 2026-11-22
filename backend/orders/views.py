import uuid
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order
from .serializer import OrderPaySerializer, OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related('car')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def pay(self, request, pk=None):
        order = self.get_object()

        if order.status != Order.Status.PENDING:
            return Response(
                {'detail': 'Этот заказ уже оплачен или отменён.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = OrderPaySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Здесь подключается проверка SMS-кода из кэша/БД или webhook эквайринга (ЮKassa / Stripe)
        sms_code = serializer.validated_data['sms_code']
        if sms_code != '1234':  # Демо-код для локальной разработки
            return Response(
                {'sms_code': ['Неверный код подтверждения.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.payment_method = serializer.validated_data['payment_method']
        order.transaction_id = f'TXN-{uuid.uuid4().hex[:10].upper()}'
        order.status = (
            Order.Status.DEPOSIT_PAID
            if order.payment_type == Order.PaymentType.DEPOSIT
            else Order.Status.PAID
        )
        order.save(update_fields=['payment_method', 'transaction_id', 'status', 'updated_at'])

        return Response(OrderSerializer(order, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status != Order.Status.PENDING:
            return Response(
                {'detail': 'Можно отменить только неоплаченный заказ.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = Order.Status.CANCELLED
        order.save(update_fields=['status', 'updated_at'])
        return Response(OrderSerializer(order, context={'request': request}).data)
