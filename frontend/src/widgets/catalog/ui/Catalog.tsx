import { useEffect, useState } from 'react';
import { getCars } from '@/entities/car/api/getCars';
import type { Car } from '@/entities/car/model/types';

function Catalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch(() => setError('Не удалось загрузить автомобили'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка автомобилей...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {cars.map((car) => (
        <div key={car.id}>
          <h3>{car.brand} {car.model}</h3>
          <p>{car.year}</p>
          <p>{car.price} ₽</p>

          {car.image && (
            <img
              src={car.image.startsWith('http')
                ? car.image
                : `/media/${car.image.replace(/^\/?media\//, '')}`}
              alt={`${car.brand} ${car.model}`}
              width="250"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Catalog;