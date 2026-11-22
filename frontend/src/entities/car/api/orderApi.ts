
import type { Car, CreateOrderPayload, Order, PayOrderPayload } from '../model/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const firstFieldError = Object.values(data).flat()[0];
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : typeof firstFieldError === 'string'
        ? firstFieldError
        : 'Ошибка при выполнении запроса';
    throw new Error(message);
  }
  return data as T;
}

export const orderApi = {
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Order[]>(res);
  },

  async getCarById(carId: number): Promise<Car> {
    const res = await fetch(`${API_BASE}/cars/${carId}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Car>(res);
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<Order>(res);
  },

  async payOrder(orderId: number, payload: PayOrderPayload): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/pay/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<Order>(res);
  },

  async cancelOrder(orderId: number): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<Order>(res);
  },
};