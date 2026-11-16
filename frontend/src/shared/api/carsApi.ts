import api from './axios'
import type { Car } from '@/entities/car/model/types';

export interface CarApiResponse{
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine: string;
  transmission: string;
  body_type: string;
  image: string | null;
  is_new: boolean;
}

export const carsApi = {
  getAll: async (): Promise<Car[]> => {
    const response = await api.get<CarApiResponse[]>('cars/');

    return response.data.map((car) => ({
      ...car,
      bodyType: car.body_type,
      isNew: car.is_new,
    }));
  },
};