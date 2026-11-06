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
  image: string;
  isNew?: boolean;
}