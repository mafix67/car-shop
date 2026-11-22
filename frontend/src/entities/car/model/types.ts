export type OrderStatus = 'pending' | 'deposit_paid' | 'paid' | 'cancelled';
export type PaymentType = 'deposit' | 'full';
export type PaymentMethod = 'card' | 'sbp' | 'credit';

export interface Order {
  id: number;
  car_details: Car;
  status: OrderStatus;
  status_display: string;
  payment_type: PaymentType;
  payment_type_display: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  amount: string;
  phone: string;
  transaction_id: string | null;
  created_at: string;
}

export interface CreateOrderPayload {
  car_id: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  phone: string;
}

export interface PayOrderPayload {
  payment_method: PaymentMethod;
  sms_code: string;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine: string;
  transmission: string;
  bodyType: string;
  image: string | null;
  isNew: boolean;
}

