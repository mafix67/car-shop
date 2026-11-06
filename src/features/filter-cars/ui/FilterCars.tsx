import './FilterCars.css';

export interface CarFilters {
  bodyType: string;
  maxPrice: number;
  sort: string;
}

interface FilterCarsProps {
  filters: CarFilters;
  onChange: (filters: CarFilters) => void;
}

export const FilterCars = ({
  filters,
  onChange,
}: FilterCarsProps) => {
  return (
    <div className="filter-cars">
      <div className="filter-cars__field">
        <label htmlFor="bodyType">Тип кузова</label>

        <select
          id="bodyType"
          value={filters.bodyType}
          onChange={(event) =>
            onChange({
              ...filters,
              bodyType: event.target.value,
            })
          }
        >
          <option value="Все">Все автомобили</option>
          <option value="Седан">Седан</option>
          <option value="Купе">Купе</option>
          <option value="Внедорожник">Внедорожник</option>
        </select>
      </div>

      <div className="filter-cars__field">
        <label htmlFor="maxPrice">
          Максимальная цена
        </label>

        <select
          id="maxPrice"
          value={filters.maxPrice}
          onChange={(event) =>
            onChange({
              ...filters,
              maxPrice: Number(event.target.value),
            })
          }
        >
          <option value={20000000}>Любая цена</option>
          <option value={5000000}>До 5 млн ₽</option>
          <option value={10000000}>До 10 млн ₽</option>
          <option value={15000000}>До 15 млн ₽</option>
        </select>
      </div>

      <div className="filter-cars__field">
        <label htmlFor="sort">Сортировка</label>

        <select
          id="sort"
          value={filters.sort}
          onChange={(event) =>
            onChange({
              ...filters,
              sort: event.target.value,
            })
          }
        >
          <option value="default">По умолчанию</option>
          <option value="asc">Сначала дешевле</option>
          <option value="desc">Сначала дороже</option>
          <option value="year">Сначала новее</option>
        </select>
      </div>
    </div>
  );
};