import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useProducts from "../../hooks/useProducts";
import CartDrawer from "../CartDrawer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const timeSlots = [
  "до 69 хв",
  "18:00 - 19:30",
  "19:30 - 21:00",
  "21:00 - 22:30",
  "Завтра, 09:00 - 10:30",
  "Інший час",
];

const getRandomSuggestions = (productsArray, count) => {
  const shuffled = [...productsArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Товари вантажимо ТІЛЬКИ коли юзер відкрив пошук — раніше
  // useProducts() викликався без умов і робив зайвий запит на КОЖНІЙ
  // сторінці сайту (навіть там де товари взагалі не показуються,
  // наприклад на /categories), саме це критикував ментор.
  const [searchEnabled, setSearchEnabled] = useState(false);
  const { products } = useProducts({ enabled: searchEnabled });

  // ✅ Отримуємо юзера з AuthContext — оновлюється автоматично після логіну
  const { user } = useAuth();

  // ✅ Отримуємо кількість товарів у кошику для бейджа
  const { cartCount } = useCart();

  const isProfilePage = location.pathname.startsWith("/profile");
  const isProductPage = location.pathname.startsWith("/product");
  const isCatalogPage = location.pathname.startsWith("/catalog");
  const isCategoriesPage = location.pathname.startsWith("/categories");
  const hideSlots = isProfilePage || isProductPage || isCatalogPage || isCategoriesPage;

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsFocused(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchFocus = () => {
    // ✅ Запускаємо завантаження товарів лише зараз, при першому фокусі
    setSearchEnabled(true);
    setIsFocused(true);
  };

  // Як тільки товари прийшли (після фокусу) — формуємо випадкові підказки
  useEffect(() => {
    if (searchEnabled && products.length > 0 && suggestedProducts.length === 0) {
      setSuggestedProducts(getRandomSuggestions(products, 5));
    }
  }, [searchEnabled, products]);

  const searchSuggestions =
    searchQuery.trim() === ""
      ? suggestedProducts
      : products
          .filter((item) => {
            const title = (item.title || item.name || "").toLowerCase();
            return title.includes(searchQuery.toLowerCase().trim());
          })
          .slice(0, 5);

  return (
    <>
      {isFocused && (
        <div
          onClick={() => setIsFocused(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 40,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      <header
        style={{
          backgroundColor: "#F5E6BE",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          zIndex: isFocused ? 50 : 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 40px",
            position: "relative",
          }}
        >
          {/* ЛІВА ЧАСТИНА: бургер + лого */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={toggleMenu}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8E1616",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              {isMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    left: "0",
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    padding: "16px 0",
                    zIndex: 100,
                    minWidth: "200px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Link to="/" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
                    Головна
                  </Link>
                  <Link to="/categories" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
                    Всі категорії
                  </Link>
                  <Link to="/catalog" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
                    Каталог товарів
                  </Link>
                  <Link to="/login" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
                    Увійти
                  </Link>
                  <Link to="/cart" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
                    Кошик
                  </Link>
                </div>
              )}
            </div>

            <Link to="/">
              <img src="/images/figma/logo/logo.svg" alt="Kalpo" style={{ height: "32px", display: "block" }} />
            </Link>
          </div>

          {/* КНОПКА "ВСІ ТОВАРИ" */}
          <Link
            to="/categories"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              border: "1px solid #8E1616", borderRadius: "24px",
              padding: "10px 20px", color: "#8E1616", textDecoration: "none",
              fontWeight: "600", fontSize: "14px", marginLeft: "24px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Всі товари
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Link>

          {/* ПОШУК */}
          <div style={{ flex: 1, margin: "0 24px", display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
              <form onSubmit={handleSearchSubmit} style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: "16px", pointerEvents: "none", display: "flex", alignItems: "center", color: "#8E1616", zIndex: 2 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Я шукаю..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  style={{
                    width: "100%", padding: "12px 40px 12px 44px",
                    borderRadius: "24px", border: "none",
                    backgroundColor: "#FFFFFF", outline: "none",
                    fontSize: "15px", color: "#202124",
                    position: "relative", zIndex: 1,
                  }}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    style={{ position: "absolute", right: "12px", background: "none", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", color: "#8E1616", zIndex: 2 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </form>

              {isFocused && (
                <div
                  style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                    backgroundColor: "#ffffff", borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    padding: "16px", display: "flex", flexDirection: "column",
                    gap: "16px", zIndex: 55, maxHeight: "450px", overflowY: "auto",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {searchSuggestions.length > 0 ? (
                      searchSuggestions.map((product) => (
                        <Link
                          to={`/product/${product.id}`}
                          key={product.id}
                          onClick={() => setIsFocused(false)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", color: "inherit", gap: "12px" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                            <div style={{ width: "40px", height: "40px", backgroundColor: "#fff", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "2px", border: "1px solid #eee" }}>
                              <img src={product.image} alt={product.title || product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => (e.target.style.display = "none")} />
                            </div>
                            <span style={{ fontSize: "13px", color: "#333", lineHeight: "1.3", fontWeight: "500" }}>
                              {product.title || product.name}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700" }}>{product.price} грн</span>
                            <button
                              type="button"
                              style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid #1e40af", backgroundColor: "#fff", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            </button>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div style={{ fontSize: "13px", color: "#888", textAlign: "center", padding: "20px 0" }}>
                        Товарів за запитом "{searchQuery}" не знайдено
                      </div>
                    )}
                  </div>

                  {searchQuery.trim() && (
                    <>
                      <div style={{ height: "1px", backgroundColor: "#f0f0f0" }}></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "#888" }}>Шукати скрізь</span>
                        <Link
                          to={`/catalog?search=${searchQuery}`}
                          onClick={() => setIsFocused(false)}
                          style={{ fontSize: "13px", color: "#333", textDecoration: "none" }}
                        >
                          Всі товари за запитом{" "}
                          <span style={{ fontWeight: "700" }}>"{searchQuery}"</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ПРАВА ЧАСТИНА: доставка + юзер + кошик */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8E1616", fontSize: "12px", marginRight: "16px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "700", fontSize: "13px", color: "#202124" }}>Доставка</span>
                <span>Біла Церква, Таращанська 161</span>
              </div>
            </div>

            {/* ✅ Юзер з AuthContext — оновлюється одразу після логіну */}
            {user ? (
              <Link
                to="/profile"
                style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #8E1616", borderRadius: "24px", padding: "10px 20px", color: "#8E1616", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user.firstName || user.name}
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ display: "flex", alignItems: "center", border: "1px solid #8E1616", borderRadius: "24px", padding: "10px 24px", color: "#8E1616", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}
              >
                Увійти
              </Link>
            )}

            {/* ✅ Кошик з бейджем — показує кількість товарів */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: "rgba(142, 22, 22, 0.2)", borderRadius: "24px",
                padding: "10px 20px", color: "#8E1616", fontWeight: "600",
                fontSize: "14px", border: "none", cursor: "pointer",
                position: "relative",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Кошик
              {/* ✅ Бейдж з кількістю — з'являється тільки коли є товари */}
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    backgroundColor: "#8E1616",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {!hideSlots && (
          <div style={{ borderTop: "1px solid rgba(142, 22, 22, 0.1)", padding: "8px 40px", display: "flex", gap: "10px", overflowX: "auto", alignItems: "center" }}>
            {[
              { img: "/images/figma/slots/slot-urgent.png",   alt: "до 69 хв" },
              { img: "/images/figma/slots/slot-1830.png",     alt: "18:00 - 19:30" },
              { img: "/images/figma/slots/slot-1930.png",     alt: "19:30 - 21:00" },
              { img: "/images/figma/slots/slot-2100.png",     alt: "21:00 - 22:30" },
              { img: "/images/figma/slots/slot-tomorrow.png", alt: "Завтра, 09:00 - 10:30" },
              { img: "/images/figma/slots/slot-other.png",    alt: "Інший час" },
            ].map((slot) => (
              <img
                key={slot.alt}
                src={slot.img}
                alt={slot.alt}
                style={{ height: "34px", cursor: "pointer", display: "block", flexShrink: 0 }}
              />
            ))}
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
