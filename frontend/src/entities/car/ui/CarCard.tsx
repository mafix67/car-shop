import type { Car } from '../model/types';
import { Button } from '../../../shared';
import { Heart, Gauge, Fuel, Settings2 } from 'lucide-react';
import './CarCard.css';

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

  return (
    <article className="car-card">
      <div className="car-card__image-wrapper">
        <img
          className="car-card__image"
          src={car.image}
          alt={`${car.brand} ${car.model}`}
        />

        {car.isNew && (
          <span className="car-card__badge">Новый</span>
        )}

        <button
          className="car-card__favorite"
          aria-label="Добавить в избранное"
          type="button"
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="car-card__content">
        <div className="car-card__heading">
          <div>
            <h3>{car.brand} {car.model}</h3>
            <span className="car-card__year">{car.year} год</span>
          </div>
        </div>

        <div className="car-card__specifications">
          <div>
            <Gauge size={16} />
            <span>
              {car.mileage.toLocaleString('ru-RU')} км
            </span>
          </div>

          <div>
            <Fuel size={16} />
            <span>{car.engine}</span>
          </div>

          <div>
            <Settings2 size={16} />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="car-card__footer">
          <div className="car-card__price">
            {formatPrice(car.price)}
          </div>

          <Button type="button">
            Подробнее
          </Button>
        </div>
      </div>
    </article>
  );
};