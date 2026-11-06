import { Search } from 'lucide-react';
import './SearchCars.css';

interface SearchCarsProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchCars = ({
  value,
  onChange,
}: SearchCarsProps) => {
  return (
    <div className="search-cars">
      <Search size={20} />

      <input
        type="text"
        placeholder="Марка или модель автомобиля..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};