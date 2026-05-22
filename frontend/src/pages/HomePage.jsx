import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import "../styles/kalpo-home.css";

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
  { id: 8, title: "Полуниця", price: 29.90, oldPrice: 44.40, discount: 33, weight: "250 г", rating: "4.6", image: "/images/figma/products/strawberry.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 9, title: "Суміш овочева", price: 129.00, oldPrice: null, discount: null, weight: "400 г", rating: "4.4", image: "/images/figma/products/broccoli.png", badgeText: "ГУРТОМ ДЕШЕВШЕ", badgeBg: "#ffdf00", badgeColor: "#000", info: "95.46 грн від 2 шт" },
  { id: 10, title: "Печиво", price: 44.90, oldPrice: 94.99, discount: 53, weight: "200 г", rating: "4.1", image: "/images/figma/products/cookies.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 11, title: "Морська капуста", price: 29.90, oldPrice: 44.40, discount: 33, weight: "100 г", rating: "4.0", image: "/images/figma/products/seaweed.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000" },
  { id: 12, title: "Чипси Lay's", price: 44.90, oldPrice: 71.90, discount: 38, weight: "133 г", rating: "4.9", image: "/images/figma/products/lays.png", badgeText: "Ціно тижики", badgeBg: "#ffdf00", badgeColor: "#000" }
];

const mockDeliveryProducts = [
  { id: 101, title: "Віскі Jameson", price: 1499.00, weight: "1 л", rating: "4.6", image: "/images/figma/products/jameson.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00", oldPrice: null, discount: null },
  { id: 102, title: "Шампанське Moet&Chandon Imperial Brut", price: 2999.00, weight: "1 л", rating: "4.6", image: "/images/figma/products/moet.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00", oldPrice: null, discount: null },
  { id: 103, title: "Ковбаса \"Кременчук\" \"Лікарська\" в/г н/о", price: 55.90, oldPrice: 44.90, discount: null, weight: "100 г", rating: "4.5", image: "/images/figma/products/sausage.png", badgeText: "ГУРТОМ ДЕШЕВШЕ", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00", info: "від 0.5 кг" },
  { id: 104, title: "Коньяк Hennessy VSOP", price: 5299.00, weight: "1 л", rating: "4.5", image: "/images/figma/products/hennessy.png", badgeText: null, deliveryTime: "з 11:00", oldPrice: null, discount: null },
  { id: 105, title: "Рідина для миття посуду Frosch Зелений лимон", price: 449.00, oldPrice: 799.00, discount: 44, weight: "5 л", rating: "4.8", image: "/images/figma/products/frosch.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" },
  { id: 106, title: "Кавоварка Tefal крапельна CM340811", price: 1599.00, oldPrice: 1999.00, discount: 20, weight: "1 шт", rating: "4.8", image: "/images/figma/products/tefal.png", badgeText: "％", badgeBg: "#ffdf00", badgeColor: "#000", deliveryTime: "з 11:00" }
];

const recipes = [
  { id: 1, title: "Сирні бейгли", time: "50 хв", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80" },
  { id: 2, title: "Паста-салат з рукколою", time: "1 год 30 хв", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80" },
  { id: 3, title: "Фалафель", time: "30 хв", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80" },
  { id: 4, title: "Фісташкове тірамісу", time: "40 хв", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80" },
  { id: 5, title: "Сніданок з авокадо", time: "15 хв", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80" },
];

export default function HomePage() {
  const { products } = useProducts();
  const safeProducts = products || [];
  const holidayProducts = safeProducts.slice(2, 8);

  const promoRef = useRef(null);
  const deliveryRef = useRef(null);
  const holidayRef = useRef(null);

  const [scrollState, setScrollState] = useState({
    promo: { left: false, right: true },
    delivery: { left: false, right: true },
    holiday: { left: false, right: true }
  });

  const handleScroll = (ref, key) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScrollState(prev => ({
        ...prev,
        [key]: {
          left: scrollLeft > 0,
          right: Math.ceil(scrollLeft + clientWidth) < scrollWidth
        }
      }));
    }
  };

  useEffect(() => {
    handleScroll(promoRef, "promo");
    handleScroll(deliveryRef, "delivery");
    handleScroll(holidayRef, "holiday");
  }, []);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -364 : 364;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="kalpo-home-wrapper" style={{ display: "flex", justifyContent: "center", width: "100%", padding: "0 24px", boxSizing: "border-box" }}>
      <div className="kalpo-home-content" style={{ maxWidth: "1152px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        <section className="kalpo-hero" style={{ display: "flex", gap: "24px", width: "100%", height: "374px", marginBottom: "32px", boxSizing: "border-box" }}>

          <div className="kalpo-hero__banner" style={{ flex: 1, position: 'relative', borderRadius: '24px', overflow: 'hidden', height: "100%" }}>
            <img src="/images/figma/hero-banner.png" alt="Тільки онлайн" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button type="button" className="kalpo-hero__arrow left" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.8)', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" className="kalpo-hero__arrow right" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.8)', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <div className="kalpo-hero__cards" style={{ flex: "0 0 518px", display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px', height: "100%" }}>
            {promoCards.map((card) => (
              <button key={card.id} type="button" style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden' }}>
                <img src={card.image} alt={card.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>

        </section>

        <section className="kalpo-section-block" style={{ background: "#ffffff", borderRadius: "28px", padding: "24px 36px", marginBottom: "8px", position: "relative" }}>
          <button onClick={() => scrollCarousel(promoRef, 'right')} style={{ position: "absolute", right: "-16px", top: "170px", width: "40px", height: "40px", borderRadius: "50%", background: "#8b181b", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(139, 24, 27, 0.3)", zIndex: 20, padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </button>

          <div className="kalpo-section__head" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="kalpo-section__head-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="kalpo-section__icon kalpo-section__icon--green" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e8f5e9", color: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>%</div>
              <div className="kalpo-section__titles">
                <h2 style={{ margin: 0, fontSize: "20px" }}>Акції</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Купуйте зі знижками все, чого кортить!</p>
              </div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/catalog" className="kalpo-section__link" style={{ fontSize: "13px", color: "#000", textDecoration: "none", fontWeight: "500" }}>Дивитись всі</Link>
              <div className="kalpo-nav-arrows" style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(promoRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.promo.left ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(promoRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.promo.right ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>

          <div
            ref={promoRef}
            onScroll={() => handleScroll(promoRef, "promo")}
            className="kalpo-products-carousel"
            style={{ display: "flex", gap: "12px", width: "calc(100% + 24px)", overflowX: "auto", scrollbarWidth: "none", padding: "16px 12px 16px 12px", margin: "-16px -12px -16px -12px", boxSizing: "border-box" }}
          >
            {mockPromoProducts.map((product) => (
              <div key={product.id} className="carousel-item" style={{ flex: "0 0 170px", width: "170px" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section className="kalpo-section-block" style={{ background: "#ffffff", borderRadius: "28px", padding: "24px 36px", marginBottom: "24px" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="kalpo-section__head-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="kalpo-section__icon kalpo-section__icon--red" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#8b181b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div className="kalpo-section__titles">
                <h2 style={{ margin: 0, fontSize: "20px" }}>ВсеДоставка</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Веземо усі забаганки — обирайте улюблені хіти й ексклюзивні цікавинки</p>
              </div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/catalog" className="kalpo-section__link" style={{ fontSize: "13px", color: "#000", textDecoration: "none", fontWeight: "500" }}>Дивитись всі</Link>
              <div className="kalpo-nav-arrows" style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(deliveryRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.delivery.left ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(deliveryRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f5f5f5", color: scrollState.delivery.right ? "#000" : "#c2c2c2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>

          <div
            ref={deliveryRef}
            onScroll={() => handleScroll(deliveryRef, "delivery")}
            className="kalpo-products-carousel"
            style={{ display: "flex", gap: "12px", width: "calc(100% + 24px)", overflowX: "auto", scrollbarWidth: "none", padding: "16px 12px 16px 12px", margin: "-16px -12px -16px -12px", boxSizing: "border-box" }}
          >
            {mockDeliveryProducts.map((product) => (
              <div key={product.id} className="carousel-item" style={{ flex: "0 0 170px", width: "170px" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section className="kalpo-section-block kalpo-section-block--holiday" style={{ background: "#8b181b", borderRadius: "28px", padding: "24px 36px", marginBottom: "24px" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="kalpo-section__head-left">
              <div className="kalpo-section__titles">
                <h2 style={{ color: 'white', margin: 0, fontSize: "20px" }}>Топ-святковості</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: "12px" }}>Передзамовляйте на потрібний день — зустрічайте свята без метушні</p>
              </div>
            </div>
            <div className="kalpo-section__head-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/catalog" className="kalpo-section__link kalpo-section__link--light" style={{ color: "white", fontSize: "13px", textDecoration: "none", fontWeight: "500" }}>Дивитись всі</Link>
              <div className="kalpo-nav-arrows" style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => scrollCarousel(holidayRef, 'left')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.2)", color: scrollState.holiday.left ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❮</button>
                <button onClick={() => scrollCarousel(holidayRef, 'right')} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.2)", color: scrollState.holiday.right ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❯</button>
              </div>
            </div>
          </div>

          <div
            ref={holidayRef}
            onScroll={() => handleScroll(holidayRef, "holiday")}
            className="kalpo-products-carousel"
            style={{ display: "flex", gap: "12px", width: "calc(100% + 24px)", overflowX: "auto", scrollbarWidth: "none", padding: "16px 12px 16px 12px", margin: "-16px -12px -16px -12px", boxSizing: "border-box" }}
          >
            {holidayProducts.map((product) => (
              <div key={product.id} className="carousel-item" style={{ flex: "0 0 170px", width: "170px" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section className="kalpo-section-block" style={{ background: "#ffffff", borderRadius: "28px", padding: "24px 36px" }}>
          <div className="kalpo-section__head" style={{ marginBottom: "20px" }}>
            <div className="kalpo-section__titles">
              <h2 style={{ margin: 0, fontSize: "20px" }}>Рецепти від Kalpo</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Прості та смачні ідеї для вашого столу</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none" }}>
            {recipes.map((recipe) => (
              <div key={recipe.id} style={{ flex: "0 0 220px", background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #eee" }}>
                <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                <div style={{ padding: "10px" }}>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#333", fontWeight: "600" }}>{recipe.title}</h4>
                  <span style={{ fontSize: "11px", color: "#888" }}>{recipe.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
