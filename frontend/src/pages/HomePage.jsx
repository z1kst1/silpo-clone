import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

const quickButtons = [
  "до 60 хв",
  "18:00 - 19:30",
  "19:30 - 21:00",
  "21:00 - 22:30",
  "Завтра, 09:00 - 10:30",
  "Інший час",
];

const sideCards = [
  "Мої пропозиції",
  "Всі акції",
  "Цінотижики",
  "Рецепти",
];

const recipes = [
  {
    id: 1,
    title: "Сирні бейгли",
    time: "50 хв",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Паста-салат з рукколою",
    time: "1 год 30 хв",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Фалафель",
    time: "30 хв",
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    title: "Фісташкове тірамісу",
    time: "40 хв",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    title: "Сніданок з авокадо",
    time: "15 хв",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80",
  },
];

export default function HomePage() {
  const { products } = useProducts();

  const promoProducts = products.slice(0, 5);
  const deliveryProducts = products.slice(2, 7);
  const holidayProducts = products.slice(4, 9);

  return (
    <div className="kalpo-home">
      <section className="kalpo-slots">
        {quickButtons.map((button) => (
          <button key={button} type="button" className="kalpo-slots__button">
            {button}
          </button>
        ))}
      </section>

      <section className="kalpo-hero">
        <div className="kalpo-hero__banner">
          <button type="button" className="kalpo-hero__arrow">
            ‹
          </button>

          <div className="kalpo-hero__banner-content">
            <div className="kalpo-hero__brand">МОЛОКІЯ</div>
            <h1>ТІЛЬКИ ОНЛАЙН</h1>
            <p>Справжня продукція щодня — швидко, вигідно та зручно.</p>
          </div>

          <div className="kalpo-hero__discount">-33%</div>

          <button type="button" className="kalpo-hero__arrow">
            ›
          </button>
        </div>

        <div className="kalpo-hero__cards">
          {sideCards.map((card) => (
            <div key={card} className="kalpo-hero__mini-card">
              <span>{card}</span>
              <div className="kalpo-hero__dots" />
            </div>
          ))}
        </div>
      </section>

      <section className="kalpo-section">
        <div className="kalpo-section__head">
          <div>
            <h2>Акції</h2>
            <p>Купуйте зі знижками все, чого кортить</p>
          </div>

          <Link to="/catalog" className="kalpo-section__link">
            Дивитись всі
          </Link>
        </div>

        <div className="kalpo-products-grid">
          {promoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="kalpo-section">
        <div className="kalpo-section__head">
          <div>
            <h2>ВсеДоставка</h2>
            <p>Веземо усі забаганки — обирайте улюблені хіти</p>
          </div>

          <Link to="/catalog" className="kalpo-section__link">
            Дивитись всі
          </Link>
        </div>

        <div className="kalpo-products-grid">
          {deliveryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="kalpo-section kalpo-section--holiday">
        <div className="kalpo-section__head kalpo-section__head--light">
          <div>
            <h2>Топ-святковості</h2>
            <p>Передзамовляйте на потрібний день — зустрічайте свята без метушні</p>
          </div>

          <Link
            to="/catalog"
            className="kalpo-section__link kalpo-section__link--light"
          >
            Дивитись всі
          </Link>
        </div>

        <div className="kalpo-products-grid kalpo-products-grid--white">
          {holidayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="kalpo-recipes">
        <div className="kalpo-section__head">
          <div>
            <h2>Рецепти</h2>
            <p>Готуйте із задоволенням. Рецепти у партнерстві із shuba.life</p>
          </div>

          <Link to="/catalog" className="kalpo-section__link">
            Дивитись всі
          </Link>
        </div>

        <div className="kalpo-recipes__grid">
          <div className="kalpo-recipes__intro">
            <h3>Рецепти оселились тут</h3>
            <p>Новий розділ — відкривайте</p>
            <button type="button">До рецептів</button>
          </div>

          {recipes.map((recipe) => (
            <article key={recipe.id} className="kalpo-recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <div className="kalpo-recipe-card__overlay">
                <span>{recipe.time}</span>
                <h4>{recipe.title}</h4>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="kalpo-info">
        <h2>Онлайн-супермаркет “Kalpo” — ваша зручна доставка продуктів додому</h2>
        <p>
          Доставка продуктів у будь-який куточок міста — найкраще рішення, якщо
          немає часу або бажання ходити в магазин. Замовити все для смаження,
          готування і прибирання ви зможете у зручному онлайн-супермаркеті
          “Kalpo”.
        </p>

        <h3>Все як в магазині, але зі зручним замовленням продуктів онлайн</h3>
        <p>
          Супермаркет “Kalpo” в форматі онлайн — це великий асортимент товарів,
          включно власний імпорт, кулінарні шедеври й товари щоденного попиту.
        </p>

        <button type="button" className="kalpo-info__more">
          Читати більше
        </button>
      </section>
    </div>
  );
}
