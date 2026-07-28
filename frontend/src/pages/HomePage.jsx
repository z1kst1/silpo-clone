import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import api from "../api/api";
import "../styles/kalpo-home.css";

const promoCards = [
  {
    id: 1,
    image: "/images/figma/cards/offers-card.png",
    alt: "Мої пропозиції",
    to: "/catalog?isPromo=true",
  },
  {
    id: 2,
    image: "/images/figma/cards/sales-card.png",
    alt: "Всі акції",
    to: "/catalog?isPromo=true",
  },
  {
    id: 3,
    image: "/images/figma/cards/weekly-card.png",
    alt: "Цінотижики",
    to: "/catalog?category=Цінотижики",
  },
  {
    id: 4,
    image: "/images/figma/cards/recipes-card.png",
    alt: "Рецепти",
    to: "/recipes",
  },
];

function RecipeCard({ recipe }) {
  return (
    <div
      style={{
        height: "270px",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

// Хук для рецептів — підключений до реального API
function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/recipes")
      .then((res) => setRecipes(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Помилка завантаження рецептів:", err))
      .finally(() => setLoading(false));
  }, []);

  return { recipes, loading };
}

export default function HomePage() {
  const promoRef = useRef(null);
  const deliveryRef = useRef(null);
  const recipesRef = useRef(null);
  const basketsRef = useRef(null);

  // ✅ Акційні товари — реальні дані з БД через /api/products?isPromo=true
  const { products: promoProducts, loading: promoLoading } = useProducts({
    isPromo: true,
    limit: 12,
  });

  // ✅ "ВсеДоставка" — поки показуємо найвищі за рейтингом товари з реальної БД
  const { products: deliveryProducts, loading: deliveryLoading } = useProducts({
    sortBy: "rating",
    order: "desc",
    limit: 12,
  });

  // ✅ Рецепти — реальні дані з БД через /api/recipes
  const { recipes, loading: recipesLoading } = useRecipes();

  const [scrollState, setScrollState] = useState({
    promo: { left: false, right: true },
    delivery: { left: false, right: true },
    recipes: { left: false, right: true },
    baskets: { left: false, right: true },
  });

  const handleScroll = (ref, key) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScrollState((prev) => ({
        ...prev,
        [key]: {
          left: scrollLeft > 0,
          right: Math.ceil(scrollLeft + clientWidth) < scrollWidth,
        },
      }));
    }
  };

  useEffect(() => {
    ["promo", "delivery", "recipes", "baskets"].forEach((key) => {
      const refs = {
        promo: promoRef,
        delivery: deliveryRef,
        recipes: recipesRef,
        baskets: basketsRef,
      };
      handleScroll(refs[key], key);
    });
  }, [promoProducts, deliveryProducts, recipes]);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -364 : 364;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className="kalpo-home-wrapper"
      style={{
        backgroundColor: "#F5E6BE",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      <div
        className="kalpo-home-content"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          paddingTop: "16px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <section
          className="kalpo-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "16px",
            width: "100%",
            marginBottom: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="kalpo-hero__banner"
            style={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              display: "block",
              height: "100%",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
            }}
          >
            <img
              src="/images/figma/hero-banner.png"
              alt="Тільки онлайн"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "24px",
                transform: "scale(1.01)",
              }}
            />
          </div>
          <div
            className="kalpo-hero__cards"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "16px",
            }}
          >
            {promoCards.map((card) => (
              <Link
                to={card.to}
                key={card.id}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "24px",
                  overflow: "hidden",
                  backgroundColor: "transparent",
                  textDecoration: "none",
                }}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "24px",
                    transform: "scale(1.01)",
                  }}
                />
              </Link>
            ))}
          </div>
        </section>

        <section
          className="kalpo-section-block"
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "16px",
            position: "relative",
          }}
        >
          <div
            className="kalpo-section__head"
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="kalpo-section__head-left"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#e8f5e9",
                  color: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                %
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px" }}>Акції</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                  Купуйте зі знижками все, чого кортить!
                </p>
              </div>
            </div>
            <div
              className="kalpo-section__head-right"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <Link
                to="/catalog"
                className="kalpo-section__link"
                style={{
                  fontSize: "13px",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Дивитись всі
              </Link>
              <div
                className="kalpo-nav-arrows"
                style={{ display: "flex", gap: "6px" }}
              >
                <button
                  onClick={() => scrollCarousel(promoRef, "left")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#f5f5f5",
                    color: scrollState.promo.left ? "#000" : "#c2c2c2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => scrollCarousel(promoRef, "right")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#f5f5f5",
                    color: scrollState.promo.right ? "#000" : "#c2c2c2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
          <div
            ref={promoRef}
            onScroll={() => handleScroll(promoRef, "promo")}
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "max(180px, calc((100% - 60px) / 6))",
              gap: "12px",
              width: "100%",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {promoLoading ? (
              <p style={{ color: "#999", fontSize: "13px" }}>Завантаження...</p>
            ) : promoProducts.length === 0 ? (
              <p style={{ color: "#999", fontSize: "13px" }}>
                Акційних товарів поки немає
              </p>
            ) : (
              promoProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </section>

        <section
          className="kalpo-section-block"
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "16px",
            position: "relative",
          }}
        >
          <div
            className="kalpo-section__head"
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="kalpo-section__head-left"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#8b181b",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px" }}>ВсеДоставка</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                  Веземо усі забаганки — обирайте улюблені хіти й ексклюзивні
                  цікавинки
                </p>
              </div>
            </div>
            <div
              className="kalpo-section__head-right"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <Link
                to="/catalog"
                className="kalpo-section__link"
                style={{
                  fontSize: "13px",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Дивитись всі
              </Link>
              <div
                className="kalpo-nav-arrows"
                style={{ display: "flex", gap: "6px" }}
              >
                <button
                  onClick={() => scrollCarousel(deliveryRef, "left")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#f5f5f5",
                    color: scrollState.delivery.left ? "#000" : "#c2c2c2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => scrollCarousel(deliveryRef, "right")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#f5f5f5",
                    color: scrollState.delivery.right ? "#000" : "#c2c2c2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
          <div
            ref={deliveryRef}
            onScroll={() => handleScroll(deliveryRef, "delivery")}
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "max(180px, calc((100% - 60px) / 6))",
              gap: "12px",
              width: "100%",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {deliveryLoading ? (
              <p style={{ color: "#999", fontSize: "13px" }}>Завантаження...</p>
            ) : (
              deliveryProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </section>

        <section
          className="kalpo-section-recipes"
          style={{ position: "relative", padding: "0 16px" }}
        >
          <div
            className="kalpo-section__head"
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="kalpo-section__head-left"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#8b181b",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px" }}>Рецепти</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                  Готуйте із задоволенням. Усе необхідне - в кошику "Kalpo".
                </p>
              </div>
            </div>
            <div
              className="kalpo-section__head-right"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <Link
                to="/recipes"
                style={{
                  fontSize: "13px",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Дивитись всі
              </Link>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => scrollCarousel(recipesRef, "left")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#fff",
                    color: scrollState.recipes.left ? "#000" : "#c2c2c2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => scrollCarousel(recipesRef, "right")}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#fff",
                    color: scrollState.recipes.right ? "#000" : "#c2c2c2",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>

          <div
            ref={recipesRef}
            onScroll={() => handleScroll(recipesRef, "recipes")}
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "160px",
              gap: "16px",
              width: "100%",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Link
              to="/recipes"
              style={{
                height: "270px",
                borderRadius: "16px",
                overflow: "hidden",
                display: "block",
              }}
            >
              <img
                src="/images/figma/recipes/recipes-promo.jpg"
                alt="Рецепти оселились тут"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Link>
            {recipesLoading ? (
              <p style={{ color: "#999", fontSize: "13px" }}>Завантаження...</p>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
