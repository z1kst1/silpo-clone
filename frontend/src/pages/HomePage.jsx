<<<<<<< HEAD
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
=======
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import "../styles/kalpo-home.css";

/* ================= ДАНІ ================= */
const promoCards = [
  { id: 1, image: "/images/figma/cards/offers-card.png", alt: "Мої пропозиції" },
  { id: 2, image: "/images/figma/cards/sales-card.png", alt: "Всі акції" },
  { id: 3, image: "/images/figma/cards/weekly-card.png", alt: "Цінотижики" },
  { id: 4, image: "/images/figma/cards/recipes-card.png", alt: "Рецепти" },
];

const mockPromoProducts = [
  { id: 1, title: "Філе куряче \"Епікур\" охолоджене, малий лоток", price: 19.40, oldPrice: 27.40, discount: 29, weight: "100 г", rating: "4.5", image: "/images/figma/products/chicken.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 2, title: "Виноград білий без кісточки", price: 120.12, oldPrice: 154.00, discount: 22, weight: "500 г", rating: "4.2", image: "/images/figma/products/grapes.png", badgeText: "％", badgeBg: "#ff9900", badgeColor: "#fff" },
  { id: 3, title: "Пиво Corona Extra світле", price: 42.99, oldPrice: 74.99, discount: 43, weight: "0,33 л", rating: "4.0", image: "/images/figma/products/corona.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 4, title: "Томати чері свіжі", price: 72.53, oldPrice: 92.90, discount: 22, weight: "200 г", rating: "3.1", image: "/images/figma/products/tomatoes.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 5, title: "Напій Pepsi Cola", price: 54.99, oldPrice: 62.40, discount: 12, weight: "1,75 л", rating: "4.4", image: "/images/figma/products/pepsi.png", badgeText: "5+1", badgeBg: "#bbf3ff", badgeColor: "#0066cc", info: "0.19 грн за кожну 6-у од" },
  { id: 6, title: "Папір туалетний NUA 3-шаровий", price: 359.00, oldPrice: 799.00, discount: 55, weight: "32 шт", rating: "4.9", image: "/images/figma/products/toilet-paper.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 7, title: "Соус Pesto", price: 119.00, oldPrice: 189.00, discount: 37, weight: "190 г", rating: "4.8", image: "/images/figma/products/pesto.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 8, title: "Полуниця", price: 29.90, oldPrice: 44.40, discount: 33, weight: "250 г", rating: "4.6", image: "/images/figma/products/strawberry.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" }
];

const mockDeliveryProducts = [
  { id: 101, title: "Віскі Jameson", price: 1499.00, weight: "1 л", rating: "4.6", image: "/images/figma/products/jameson.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" },
  { id: 102, title: "Шампанське Moet&Chandon Imperial Brut", price: 2999.00, weight: "1 л", rating: "4.6", image: "/images/figma/products/moet.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" },
  { id: 103, title: "Ковбаса \"Кременчук\" \"Лікарська\" в/г н/о", price: 55.90, oldPrice: 44.90, weight: "100 г", rating: "4.5", image: "/images/figma/products/sausage.png", badgeText: "ГУРТОМ ДЕШЕВШЕ", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00", info: "від 0.5 кг" },
  { id: 104, title: "Коньяк Hennessy VSOP", price: 5299.00, weight: "1 л", rating: "4.5", image: "/images/figma/products/hennessy.png", deliveryTime: "з 11:00" },
  { id: 105, title: "Рідина для миття посуду Frosch Зелений лимон", price: 449.00, oldPrice: 799.00, discount: 44, weight: "5 л", rating: "4.8", image: "/images/figma/products/frosch.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" },
  { id: 106, title: "Кавоварка Tefal крапельна CM340811", price: 1599.00, oldPrice: 1999.00, discount: 20, weight: "1 шт", rating: "4.8", image: "/images/figma/products/tefal.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" },
  { id: 107, title: "Вино ігристе Bottega Gold Prosecco Brut", price: 1199.00, oldPrice: 1499.00, discount: 20, weight: "0.75 л", rating: "4.7", image: "/images/figma/products/prosecco.png", deliveryTime: "з 11:00" },
  { id: 108, title: "Блендер занурювальний", price: 2399.00, oldPrice: 3399.00, discount: 29, weight: "1 шт", rating: "4.8", image: "/images/figma/products/blender.png", deliveryTime: "з 11:00" },
  { id: 109, title: "Шампунь-ванна Kerastase Genesis", price: 1399.00, oldPrice: 1999.00, discount: 30, weight: "250 мл", rating: "4.9", image: "/images/figma/products/shampoo.png", deliveryTime: "з 11:00" },
  { id: 110, title: "Віскі Chivas Regal Extra", price: 1899.00, weight: "0.7 л", rating: "4.8", image: "/images/figma/products/chivas.png", deliveryTime: "з 11:00" },
  { id: 111, title: "Ковбаса с/в Салямі", price: 399.00, oldPrice: 499.00, discount: 20, weight: "1 кг", rating: "4.6", image: "/images/figma/products/salami.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" },
  { id: 112, title: "Стейк Рібай з яловичини", price: 151.92, oldPrice: 189.90, discount: 20, weight: "100 г", rating: "4.5", image: "/images/figma/products/steak.png", deliveryTime: "з 11:00" }
];

const mockRecipes = [
  { id: 1, title: "Сирні бейгли", image: "/images/figma/recipes/cheese-bagels.jpg" },
  { id: 2, title: "Паста-салат з куркою", image: "/images/figma/recipes/pasta-salad.jpg" },
  { id: 3, title: "Фалафель", image: "/images/figma/recipes/falafel.jpg" },
  { id: 4, title: "Фісташкове тирамісу", image: "/images/figma/recipes/pistachio-tiramisu.jpg" },
  { id: 5, title: "Відкритий сендвіч з редискою та авокадо", image: "/images/figma/recipes/radish-avocado-sandwich.jpg" },
  { id: 6, title: "Мічелада", image: "/images/figma/recipes/michelada.jpg" },
  { id: 7, title: "Вівчарський пиріг", image: "/images/figma/recipes/shepherds-pie.jpg" },
  { id: 8, title: "Паста з горілкою та лимоном", image: "/images/figma/recipes/vodka-lemon-pasta.jpg" },
  { id: 9, title: "Віденський шніцель", image: "/images/figma/recipes/viennese-schnitzel.jpg" },
  { id: 10, title: "Пісний салат з капусти з фініковою заправкою", image: "/images/figma/recipes/cabbage-date-salad.jpg" },
  { id: 11, title: "Запечена редиска із соусом", image: "/images/figma/recipes/baked-radish.jpg" }
];

/* Встановили правильні шляхи до папки /figma/baskets/ */
const mockBaskets = [
  { id: 301, title: "Святковий бокс Light", price: 1249.00, weight: "шт", image: "/images/figma/baskets/box-light.jpg", buttonText: "Предзамовити" },
  { id: 302, title: "Святковий бокс Classic", price: 1899.00, weight: "шт", image: "/images/figma/baskets/box-classic.jpg", buttonText: "Предзамовити" },
  { id: 303, title: "Святковий бокс Grand", price: 3399.00, weight: "шт", image: "/images/figma/baskets/box-grand.jpg", buttonText: "Предзамовити" },
  { id: 304, title: "Святковий бокс Light плюс", price: 1299.00, weight: "шт", image: "/images/figma/baskets/box-light-plus.jpg", buttonText: "Предзамовити" },
  { id: 305, title: "Святковий бокс Classic плюс", price: 1999.00, weight: "шт", image: "/images/figma/baskets/box-classic-plus.jpg", buttonText: "Предзамовити" },
  { id: 306, title: "Святковий бокс Grand плюс", price: 3649.00, weight: "шт", image: "/images/figma/baskets/box-grand-plus.jpg", buttonText: "Предзамовити" },
  { id: 307, title: "Святковий бокс Family", price: 2727.00, weight: "шт", image: "/images/figma/baskets/box-family.jpg", buttonText: "Предзамовити" },
  { id: 308, title: "Святковий бокс Premium", price: 4999.00, weight: "шт", image: "/images/figma/baskets/box-premium.jpg", buttonText: "Предзамовити" }
];

/* ================= КОМПОНЕНТ РЕЦЕПТУ ================= */
function RecipeCard({ recipe }) {
  return (
    <div style={{ flex: "0 0 160px", height: "270px", borderRadius: "16px", position: "relative", overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", flexShrink: 0 }}>
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

/* ================= ГОЛОВНА СТОРІНКА ================= */
export default function HomePage() {
  const promoRef = useRef(null);
  const deliveryRef = useRef(null);
  const recipesRef = useRef(null);
  const basketsRef = useRef(null);

  const [scrollState, setScrollState] = useState({
    promo: { left: false, right: true },
    delivery: { left: false, right: true },
    recipes: { left: false, right: true },
    baskets: { left: false, right: true }
  });

  const handleScroll = (ref, key) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScrollState(prev => ({ ...prev, [key]: { left: scrollLeft > 0, right: Math.ceil(scrollLeft + clientWidth) < scrollWidth } }));
    }
  };

  useEffect(() => {
    ['promo', 'delivery', 'recipes', 'baskets'].forEach(key => {
      const refs = { promo: promoRef, delivery: deliveryRef, recipes: recipesRef, baskets: basketsRef };
      handleScroll(refs[key], key);
    });
  }, []);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -364 : 364;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="kalpo-home-wrapper" style={{ backgroundColor: "#f4ead5", minHeight: "100vh", paddingBottom: "40px" }}>
      <div className="kalpo-home-content" style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "8px" }}>

        {/* 1. БАНЕР ТА ПРОМО КАРТКИ */}
        <section className="kalpo-hero" style={{ display: "flex", gap: "12px", width: "100%", height: "220px", boxSizing: "border-box" }}>
          <div className="kalpo-hero__banner" style={{ flex: 1, position: 'relative', borderRadius: '20px', overflow: 'hidden', height: "100%", backgroundColor: "#7ec34c" }}>
            <img src="/images/figma/hero-banner.png" alt="Тільки онлайн" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          </div>
          <div className="kalpo-hero__cards" style={{ flex: "0 0 420px", display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', height: "100%" }}>
            {promoCards.map((card) => (
              <button key={card.id} type="button" style={{ padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={card.image} alt={card.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </section>

        {/* 2. АКЦІЇ */}
        <section className="kalpo-section-block" style={{ background: "#ffffff", borderRadius: "20px", padding: "16px", position: "relative" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="kalpo-section__head-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e8f5e9", color: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>%</div>
              <div><h2 style={{ margin: 0, fontSize: "18px" }}>Акції</h2><p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Купуйте зі знижками все, чого кортить!</p></div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/catalog" className="kalpo-section__link" style={{ fontSize: "13px", color: "#000", textDecoration: "none", fontWeight: "500" }}>Дивитись всі</Link>
              <div className="kalpo-nav-arrows" style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(promoRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.promo.left ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(promoRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.promo.right ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>
          <div ref={promoRef} onScroll={() => handleScroll(promoRef, "promo")} style={{ display: "flex", gap: "12px", width: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
            {mockPromoProducts.map((product) => (<div key={product.id} style={{ flex: "0 0 calc((100% - 60px) / 6)", minWidth: "180px" }}><ProductCard product={product} /></div>))}
          </div>
        </section>

        {/* 3. ВСЕДОСТАВКА */}
        <section className="kalpo-section-block" style={{ background: "#ffffff", borderRadius: "20px", padding: "16px", position: "relative" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="kalpo-section__head-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#8b181b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div><h2 style={{ margin: 0, fontSize: "18px" }}>ВсеДоставка</h2><p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Веземо усі забаганки — обирайте улюблені хіти й ексклюзивні цікавинки</p></div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/catalog" className="kalpo-section__link" style={{ fontSize: "13px", color: "#000", textDecoration: "none", fontWeight: "500" }}>Дивитись всі</Link>
              <div className="kalpo-nav-arrows" style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(deliveryRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.delivery.left ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(deliveryRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.delivery.right ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>
          <div ref={deliveryRef} onScroll={() => handleScroll(deliveryRef, "delivery")} style={{ display: "flex", gap: "12px", width: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
            {mockDeliveryProducts.map((product) => (<div key={product.id} style={{ flex: "0 0 calc((100% - 60px) / 6)", minWidth: "180px" }}><ProductCard product={product} /></div>))}
          </div>
        </section>

        {/* 4. РЕЦЕПТИ */}
        <section className="kalpo-section-recipes" style={{ position: "relative" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="kalpo-section__head-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#8b181b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              </div>
              <div><h2 style={{ margin: 0, fontSize: "18px" }}>Рецепти</h2><p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Готуйте із задоволенням. Усе необхідне - в кошику "Kalpo".</p></div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/recipes" style={{ fontSize: "13px", color: "#000", textDecoration: "none", fontWeight: "500" }}>Дивитись всі</Link>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(recipesRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#fff", color: scrollState.recipes.left ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(recipesRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#fff", color: scrollState.recipes.right ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>

          <div ref={recipesRef} onScroll={() => handleScroll(recipesRef, "recipes")} style={{ display: "flex", gap: "16px", width: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
            <Link to="/recipes" style={{ flex: "0 0 160px", height: "270px", borderRadius: "16px", overflow: "hidden", display: "block", flexShrink: 0 }}>
              <img src="/images/figma/recipes/recipes-promo.jpg" alt="Рецепти оселились тут" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </Link>
            {mockRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* 5. ВЕЛИКОДНІ КОШИКИ */}
        <section className="kalpo-section-baskets" style={{ background: "#fff9c4", borderRadius: "24px", paddingTop: "20px", position: "relative", overflow: "hidden" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", zIndex: 2, position: "relative" }}>
            <div className="kalpo-section__head-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff", color: "#333", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              </div>
              <div><h2 style={{ margin: 0, fontSize: "18px", color: "#333" }}>Великодні кошики</h2><p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Предзамовлення на святковості відкрито!</p></div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
               <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(basketsRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.8)", color: scrollState.baskets.left ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(basketsRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.8)", color: scrollState.baskets.right ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>

          <div style={{ background: "#ffffff", borderTopLeftRadius: "32px", borderTopRightRadius: "32px", padding: "24px 16px", position: "relative", zIndex: 2 }}>
            <div ref={basketsRef} onScroll={() => handleScroll(basketsRef, "baskets")} style={{ display: "flex", gap: "12px", width: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
              {mockBaskets.map((product) => (
                <div key={product.id} style={{ flex: "0 0 calc((100% - 60px) / 6)", minWidth: "180px" }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
>>>>>>> feature/reviews-orders
    </div>
  );
}
