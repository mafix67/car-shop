import { ArrowRight, ShieldCheck, Wallet, Headphones } from 'lucide-react';

import { Header } from '@/widgets/header';
import { Catalog } from '@/widgets/catalog';
import { Button } from '@/shared/ui';

import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="home-page">
      <Header />

      <main>
        <section className="hero">
          <div className="hero__container">
            <div className="hero__content">
              <span className="hero__label">
                ПРЕМИАЛЬНЫЙ АВТОМОБИЛЬНЫЙ МАРКЕТПЛЕЙС
              </span>

              <h1>
                Найди автомобиль
                <br />
                <span>своей мечты</span>
              </h1>

              <p>
                Большой выбор новых и подержанных автомобилей.
                Выгодные предложения, проверенные продавцы
                и комфортная покупка.
              </p>

              <div className="hero__actions">
                <Button
                  onClick={() =>
                    document
                      .getElementById('catalog')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Смотреть каталог
                  <ArrowRight size={17} />
                </Button>

                <span className="hero__description">
                  Более 1000 автомобилей
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="advantages" id="advantages">
          <div className="advantages__container">
            <div className="advantages__item">
              <ShieldCheck size={30} />

              <div>
                <h3>Проверенные авто</h3>
                <p>Каждый автомобиль проходит проверку</p>
              </div>
            </div>

            <div className="advantages__item">
              <Wallet size={30} />

              <div>
                <h3>Выгодные цены</h3>
                <p>Подбираем лучшие предложения</p>
              </div>
            </div>

            <div className="advantages__item">
              <Headphones size={30} />

              <div>
                <h3>Поддержка 24/7</h3>
                <p>Помогаем на каждом этапе покупки</p>
              </div>
            </div>
          </div>
        </section>

        <Catalog />

        <section className="home-cta" id="contacts">
          <h2>Не нашли подходящий автомобиль?</h2>

          <p>
            Свяжитесь с нами, и мы поможем подобрать
            автомобиль под ваши требования.
          </p>

          <Button
            onClick={() => {
              window.location.href = 'mailto:info@example.com';
            }}
          >
            Оставить заявку
          </Button>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__container">
          <span>
            © 2026 AUTOMARKET. Все права защищены.
          </span>

          <span>Автомобили для вашей жизни</span>
        </div>
      </footer>
    </div>
  );
};