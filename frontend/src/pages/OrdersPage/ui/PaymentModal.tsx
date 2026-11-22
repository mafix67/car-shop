import React, { useState } from 'react';
import type { Order, PaymentMethod } from '@/entities/car/model/types';
import { orderApi } from '@/entities/car/api/orderApi';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: (updatedOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(order.payment_method);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [step, setStep] = useState<'details' | 'sms'>('details');
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleProceedToSms = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (method === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16 || cardExpiry.length < 5 || cardCvc.length < 3) {
        setError('Заполните корректные реквизиты банковской карты.');
        return;
      }
    }

    setStep('sms');
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updated = await orderApi.payOrder(order.id, {
        payment_method: method,
        sms_code: smsCode,
      });
      onSuccess(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось провести платёж');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal__backdrop" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal__header">
          <h2 className="payment-modal__title">Оплата заказа #{order.id}</h2>
          <button
            type="button"
            className="payment-modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="payment-modal__summary">
          <span className="payment-modal__car">
            {order.car_details.brand} {order.car_details.model} ({order.car_details.year})
          </span>
          <span className="payment-modal__type">{order.payment_type_display}</span>
          <strong className="payment-modal__amount">
            {Number(order.amount).toLocaleString('ru-RU')} ₽
          </strong>
        </div>

        {error && <div className="payment-modal__error">{error}</div>}

        {step === 'details' ? (
          <form className="payment-modal__form" onSubmit={handleProceedToSms}>
            <div className="payment-modal__methods">
              <button
                type="button"
                className={`payment-modal__method-btn ${
                  method === 'card' ? 'payment-modal__method-btn--active' : ''
                }`}
                onClick={() => setMethod('card')}
              >
                Карта онлайн
              </button>
              <button
                type="button"
                className={`payment-modal__method-btn ${
                  method === 'sbp' ? 'payment-modal__method-btn--active' : ''
                }`}
                onClick={() => setMethod('sbp')}
              >
                СБП
              </button>
              <button
                type="button"
                className={`payment-modal__method-btn ${
                  method === 'credit' ? 'payment-modal__method-btn--active' : ''
                }`}
                onClick={() => setMethod('credit')}
              >
                Автокредит
              </button>
            </div>

            {method === 'card' && (
              <div className="payment-modal__card-fields">
                <label className="payment-modal__label">
                  Номер карты
                  <input
                    type="text"
                    className="payment-modal__input"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    required
                  />
                </label>
                <div className="payment-modal__row">
                  <label className="payment-modal__label">
                    Срок действия
                    <input
                      type="text"
                      className="payment-modal__input"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      required
                    />
                  </label>
                  <label className="payment-modal__label">
                    CVC / CVV
                    <input
                      type="password"
                      className="payment-modal__input"
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </label>
                </div>
              </div>
            )}

            {method === 'sbp' && (
              <div className="payment-modal__info-box">
                После нажатия «Продолжить» на номер <strong>{order.phone}</strong> придёт
                SMS-код для подтверждения списания через Систему быстрых платежей.
              </div>
            )}

            {method === 'credit' && (
              <div className="payment-modal__info-box">
                Подтвердите заявку SMS-кодом — менеджер автосалона свяжется по номеру{' '}
                <strong>{order.phone}</strong> для подписания кредитного договора.
              </div>
            )}

            <button type="submit" className="orders-btn orders-btn--primary orders-btn--full">
              Продолжить
            </button>
          </form>
        ) : (
          <form className="payment-modal__form" onSubmit={handleConfirmPayment}>
            <p className="payment-modal__sms-hint">
              Код подтверждения отправлен на номер <strong>{order.phone}</strong> (для теста
              введите <code>1234</code>).
            </p>
            <label className="payment-modal__label">
              Код из SMS
              <input
                type="text"
                className="payment-modal__input payment-modal__input--code"
                placeholder="1234"
                maxLength={4}
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                required
              />
            </label>
            <div className="payment-modal__actions">
              <button
                type="button"
                className="orders-btn orders-btn--secondary"
                onClick={() => setStep('details')}
                disabled={loading}
              >
                Назад
              </button>
              <button
                type="submit"
                className="orders-btn orders-btn--primary"
                disabled={loading || smsCode.length < 4}
              >
                {loading ? 'Обработка...' : 'Подтвердить оплату'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};