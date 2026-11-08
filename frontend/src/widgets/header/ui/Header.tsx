import { CarFront, Heart, Menu } from 'lucide-react';
import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          <CarFront size={30} />

          <span>
            AUTO<span className="header__logo-accent">MARKET</span>
          </span>
        </a>

        <nav className="header__nav">
          <a href="#catalog">Каталог</a>
          <a href="#advantages">Преимущества</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="header__actions">
          <button
            className="header__favorite"
            type="button"
            aria-label="Избранное"
          >
            <Heart size={20} />
          </button>

          <button className="header__contact" type="button">
            Связаться с нами
          </button>
        </div>

        <button
          className="header__mobile-menu"
          type="button"
          aria-label="Открыть меню"
        >
          <Menu size={25} />
        </button>
      </div>
    </header>
  );
};