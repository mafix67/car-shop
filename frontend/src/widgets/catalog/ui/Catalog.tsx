import { useMemo, useState } from 'react';

import {
  cars,
  CarCard,
} from '@/entities/car';

import {
  SearchCars,
  FilterCars,
  type CarFilters,
} from '@/features';

import './Catalog.css';

export const Catalog = () => {
  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState<CarFilters>({
    bodyType: 'Все',
    maxPrice: 20000000,
    sort: 'default',
  });

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        `${car.brand} ${car.model}`
          .toLowerCase()
          .includes(searchValue);

      const matchesBody =
        filters.bodyType === 'Все' ||
        car.bodyType === filters.bodyType;

      const matchesPrice =
        car.price <= filters.maxPrice;

      return matchesSearch && matchesBody && matchesPrice;
    });

    if (filters.sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    }

    if (filters.sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    if (filters.sort === 'year') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [search, filters]);

  return (
    <section className="catalog" id="catalog">
      <div className="catalog__header">
        <div>
          <span className="catalog__subtitle">
            НАШ АВТОПАРК
          </span>

          <h2>Каталог автомобилей</h2>

          <p>
            Выберите автомобиль своей мечты
          </p>
        </div>

        <span className="catalog__count">
          Найдено: {filteredCars.length}
        </span>
      </div>

      <div className="catalog__filters">
        <SearchCars
          value={search}
          onChange={setSearch}
        />

        <FilterCars
          filters={filters}
          onChange={setFilters}
        />
      </div>

      <div className="catalog__grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
            />
          ))
        ) : (
          <div className="catalog__empty">
            <h3>Автомобили не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </section>
  );
};