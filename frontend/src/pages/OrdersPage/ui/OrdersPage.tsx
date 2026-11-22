import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  Car,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentType,
} from '@/entities/car/model/types';
import { orderApi } from '@/entities/car/api/orderApi';
import { PaymentModal } from './PaymentModal';
import '../styles/OrdersPage.css';

const DEPOSIT_AMOUNT = 50000;

export const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const carIdParam = searchParams.get('carId');

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [activeOrderForPay, setActiveOrderForPay] = useState<Order | null>(null);

  const [paymentType, setPaymentType] = useState<PaymentType>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersData = await orderApi.getOrders();
        setOrders(ordersData);

        if (carIdParam) {
          const carData = await orderApi.getCarById(Number(carIdParam));
          setSelectedCar(carData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carIdParam]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    setSubmitting(true);
    setError(null);

    try {
      const createdOrder = await orderApi.createOrder({
        car_id: selectedCar.id,
        payment_type: paymentType,
        payment_method: paymentMethod,
        phone,
      });

      setOrders((prev) => [createdOrder, ...prev]);
      setSelectedCar(null);
      setSearchParams({});
      setActiveOrderForPay(createdOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось оформить заказ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const updated = await orderApi.cancelOrder(orderId);
      setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отменить заказ');
    }
  };

  const handlePaymentSuccess = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
    );
    setActiveOrderForPay(null);
  };

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const calculatedPrice = selectedCar
    ? paymentType === 'deposit'
      ? Math.min(DEPOSIT_AMOUNT, Number(selectedCar.price))
      : Number(selectedCar.price)
    : 0;

  return (
    <main className="orders-page">
      <div className="orders-page__container">
        <header className="orders-page__header">
          <h1 className="orders-page__title">Заказы и оплата</h1>
          <p className="orders-page__subtitle">
            Оформление бронирования, полная оплата автомобилей и история транзакций
          </p>
        </header>

        {error && <div className="orders-page__alert">{error}</div>}

        {selectedCar && (
          <section className="checkout-card">
            <div className="checkout-card__car">
              {selectedCar.image && (
                <img
                  src={selectedCar.image}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="checkout-card__image"
                />
              )}
              <div className="checkout-card__car-info">
                <span className="checkout-card__badge">Новый заказ</span>
                <h2 className="checkout-card__car-title">
                  {selectedCar.brand} {selectedCar.model}, {selectedCar.year}
                </h2>
                <p className="checkout-card__full-price">
                  Полная стоимость: {Number(selectedCar.price).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            <form className="checkout-card__form" onSubmit={handleCreateOrder}>
              <div className="checkout-card__group">
                <span className="checkout-card__label">Формат оплаты</span>
                <div className="checkout-card__radio-row">
                  <label
                    className={`checkout-card__option ${
                      paymentType === 'deposit' ? 'checkout-card__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value="deposit"
                      checked={paymentType === 'deposit'}
                      onChange={() => setPaymentType('deposit')}
                    />
                    <span>Бронирование (50 000 ₽)</span>
                  </label>
                  <label
                    className={`checkout-card__option ${
                      paymentType === 'full' ? 'checkout-card__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentType === 'full'}
                      onChange={() => setPaymentType('full')}
                    />
                    <span>Полная оплата</span>
                  </label>
                </div>
              </div>

              <div className="checkout-card__group">
                <span className="checkout-card__label">Способ оплаты</span>
                <select
                  className="checkout-card__select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  <option value="card">Банковская карта</option>
                  <option value="sbp">СБП (Система быстрых платежей)</option>
                  <option value="credit">Автокредит</option>
                </select>
              </div>

              <div className="checkout-card__group">
                <label className="checkout-card__label" htmlFor="order-phone">
                  Контактный телефон
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  className="checkout-card__input"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="checkout-card__footer">
                <div className="checkout-card__total">
                  <span>Итого к оплате:</span>
                  <strong>{calculatedPrice.toLocaleString('ru-RU')} ₽</strong>
                </div>
                <div className="checkout-card__actions">
                  <button
                    type="button"
                    className="orders-btn orders-btn--secondary"
                    onClick={() => {
                      setSelectedCar(null);
                      setSearchParams({});
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="orders-btn orders-btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Создание...' : 'Перейти к оплате'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        <div className="orders-page__filters">
          {(
            [
              ['all', 'Все заказы'],
              ['pending', 'Ожидают оплаты'],
              ['deposit_paid', 'Забронированы'],
              ['paid', 'Оплачены'],
              ['cancelled', 'Отменённые'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`orders-page__filter-btn ${
                statusFilter === value ? 'orders-page__filter-btn--active' : ''
              }`}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="orders-page__empty">Загрузка заказов...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-page__empty">Заказов в выбранной категории пока нет.</div>
        ) : (
          <section className="orders-list">
            {filteredOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card__media">
                  {order.car_details.image ? (
                    <img
                      src={order.car_details.image}
                      alt={`${order.car_details.brand} ${order.car_details.model}`}
                      className="order-card__image"
                    />
                  ) : (
                    <div className="order-card__placeholder">Нет фото</div>
                  )}
                </div>

                <div className="order-card__body">
                  <div className="order-card__top">
                    <div>
                      <span className="order-card__number">
                        Заказ #{order.id} от{' '}
                        {new Date(order.created_at).toLocaleDateString('ru-RU')}
                      </span>
                      <h3 className="order-card__title">
                        {order.car_details.brand} {order.car_details.model} (
                        {order.car_details.year})
                      </h3>
                    </div>
                    <span className={`order-card__status order-card__status--${order.status}`}>
                      {order.status_display}
                    </span>
                  </div>

                  <div className="order-card__meta">
                    <span>Формат: {order.payment_type_display}</span>
                    <span>Способ: {order.payment_method_display}</span>
                    {order.transaction_id && <span>Транзакция: {order.transaction_id}</span>}
                  </div>

                  <div className="order-card__bottom">
                    <div className="order-card__price">
                      <span>Сумма:</span>
                      <strong>{Number(order.amount).toLocaleString('ru-RU')} ₽</strong>
                    </div>

                    {order.status === 'pending' && (
                      <div className="order-card__actions">
                        <button
                          type="button"
                          className="orders-btn orders-btn--secondary"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Отменить
                        </button>
                        <button
                          type="button"
                          className="orders-btn orders-btn--primary"
                          onClick={() => setActiveOrderForPay(order)}
                        >
                          Оплатить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {activeOrderForPay && (
        <PaymentModal
          order={activeOrderForPay}
          onClose={() => setActiveOrderForPay(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
};