import { Link } from "react-router";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const popularProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-banner__content">
          <span className="hero-banner__label">Онлайн-супермаркет</span>
          <h1>Смакує по-сільпівськи</h1>
          <p>
            Замовляй улюблені продукти швидко, зручно та в сучасному інтерфейсі.
          </p>

          <div className="hero-banner__actions">
            <Link to="/catalog" className="green-button">
              Перейти до каталогу
            </Link>

            <Link to="/register" className="white-button">
              Створити акаунт
            </Link>
          </div>
        </div>

        <div className="hero-banner__cards">
          <div className="promo-card promo-card--yellow">
            <span className="promo-card__small">Суперціни</span>
            <h3>-25% на фрукти</h3>
            <p>Лови свіжі пропозиції цього тижня</p>
          </div>

          <div className="promo-card promo-card--green">
            <span className="promo-card__small">Швидко</span>
            <h3>Доставка день у день</h3>
            <p>Оформи замовлення за кілька хвилин</p>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-title">
          <h2>Популярні категорії</h2>
          <p>Оберіть те, що потрібно саме зараз</p>
        </div>

        <div className="categories-grid">
          <div className="category-box">Фрукти</div>
          <div className="category-box">Овочі</div>
          <div className="category-box">Молочні продукти</div>
          <div className="category-box">Сніданки</div>
          <div className="category-box">Напої</div>
          <div className="category-box">Солодощі</div>
        </div>
      </section>

      <section className="advantages-section">
        <div className="advantage-card">
          <h3>Свіжі продукти</h3>
          <p>Якісні товари та зручний вибір у кілька кліків.</p>
        </div>

        <div className="advantage-card">
          <h3>Швидка доставка</h3>
          <p>Зручне замовлення додому або в офіс без зайвих клопотів.</p>
        </div>

        <div className="advantage-card">
          <h3>Знижки та акції</h3>
          <p>Вигідні пропозиції для покупок щодня.</p>
        </div>
      </section>

      <section className="products-section">
        <div className="section-title">
          <h2>Популярні товари</h2>
          <p>Товари, які найчастіше обирають користувачі</p>
        </div>

        <div className="products-grid">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
