import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useProducts from "../../hooks/useProducts";

const timeSlots = [
  "до 69 хв",
  "18:00 - 19:30",
  "19:30 - 21:00",
  "21:00 - 22:30",
  "Завтра, 09:00 - 10:30",
  "Інший час",
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Стани пошуку
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Дістаємо всі реальні товари з твоєї бази
  const { products } = useProducts();

  const isProfilePage = location.pathname.startsWith("/profile");
  const isProductPage = location.pathname.startsWith("/product");
  const isCatalogPage = location.pathname.startsWith("/catalog");
  const isCategoriesPage = location.pathname.startsWith("/categories");
  const hideSlots = isProfilePage || isProductPage || isCatalogPage || isCategoriesPage;

  useEffect(() => {
    const savedUser = localStorage.getItem("silpo-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  // Динамічна логіка пошуку
  const searchSuggestions = searchQuery.trim() === ""
    ? products.slice(0, 5)
    : products.filter((item) => {
        const title = (item.title || item.name || "").toLowerCase();
        return title.includes(searchQuery.toLowerCase().trim());
      }).slice(0, 5);

  return (
    <>
      {/* ЗАТЕМНЕННЯ ФОНУ */}
      {isFocused && (
        <div
          onClick={() => setIsFocused(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 40, transition: "opacity 0.3s ease"
          }}
        />
      )}

      <header style={{ backgroundColor: "#F5E6BE", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", zIndex: isFocused ? 50 : 10 }}>

        {/* ВЕРХНЯ ПАНЕЛЬ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: "1440px", margin: "0 auto", position: "relative" }}>

          {/* 1. БУРГЕР МЕНЮ ТА ЛОГОТИП */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={toggleMenu}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#8E1616", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              {/* ВИПАДАЮЧЕ МЕНЮ (БУРГЕР) */}
              {isMenuOpen && (
                <div style={{ position: "absolute", top: "40px", left: "0", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "16px 0", zIndex: 100, minWidth: "200px", display: "flex", flexDirection: "column" }}>
                  <Link to="/" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Головна</Link>
                  <Link to="/categories" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Всі категорії</Link>
                  <Link to="/catalog" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Каталог товарів</Link>
                  <Link to="/login" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Увійти</Link>
                  <Link to="/cart" onClick={closeMenu} style={{ padding: "12px 24px", color: "#202124", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Кошик</Link>
                </div>
              )}
            </div>

            {/* Твій оригінальний логотип */}
            <Link to="/">
              <img src="/images/figma/logo/logo.svg" alt="Kalpo" style={{ height: "32px", display: "block" }} />
            </Link>
          </div>

          {/* 2. КНОПКА "Всі товари" */}
          <Link to="/categories" style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #8E1616", borderRadius: "24px", padding: "10px 20px", color: "#8E1616", textDecoration: "none", fontWeight: "600", fontSize: "14px", marginLeft: "24px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Всі товари
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </Link>

          {/* 3. БЛОК ПОШУКУ */}
          <div style={{ flex: 1, margin: "0 24px", display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
              <form onSubmit={handleSearchSubmit} style={{ width: "100%", display: "flex", alignItems: "center" }}>

                <div style={{ position: "absolute", left: "16px", pointerEvents: "none", display: "flex", alignItems: "center", color: "#8E1616", zIndex: 2 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                <input
                  type="text"
                  placeholder="Я шукаю..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  style={{
                    width: "100%", padding: "12px 40px 12px 44px", borderRadius: "24px",
                    border: "none", backgroundColor: "#FFFFFF",
                    outline: "none", fontSize: "15px", color: "#202124", position: "relative", zIndex: 1
                  }}
                />

                {searchQuery && (
                  <button type="button" onClick={clearSearch} style={{ position: "absolute", right: "12px", background: "none", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", color: "#8E1616", zIndex: 2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                )}
              </form>

              {/* ВИПАДАЮЧИЙ СПИСОК (РЕАЛЬНІ ДАНІ) */}
              {isFocused && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  padding: "16px", display: "flex", flexDirection: "column", gap: "16px",
                  zIndex: 55, maxHeight: "450px", overflowY: "auto"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {searchSuggestions.length > 0 ? (
                      searchSuggestions.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} onClick={() => setIsFocused(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", color: "inherit", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                            <div style={{ width: "40px", height: "40px", backgroundColor: "#fff", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "2px", border: "1px solid #eee" }}>
                              <img src={product.image} alt={product.title || product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
                            </div>
                            <span style={{ fontSize: "13px", color: "#333", lineHeight: "1.3", fontWeight: "500" }}>{product.title || product.name}</span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700" }}>{product.price} грн</span>
                            <button type="button" style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid #1e40af", backgroundColor: "#fff", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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

                  {/* Пошук в категоріях */}
                  {searchQuery.trim() && (
                    <>
                      <div style={{ height: "1px", backgroundColor: "#f0f0f0" }}></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "#888" }}>Шукати скрізь</span>
                        <Link to={`/catalog?search=${searchQuery}`} onClick={() => setIsFocused(false)} style={{ fontSize: "13px", color: "#333", textDecoration: "none" }}>
                          Всі товари за запитом <span style={{ fontWeight: "700" }}>"{searchQuery}"</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. ПРАВА ЧАСТИНА (Локація, Профіль, Кошик) */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8E1616", fontSize: "12px", marginRight: "16px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "700", fontSize: "13px", color: "#202124" }}>Доставка</span>
                <span>Біла Церква, Таращанська 161</span>
              </div>
            </div>

            {user ? (
              <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #8E1616", borderRadius: "24px", padding: "10px 20px", color: "#8E1616", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {user.firstName || user.name}
              </Link>
            ) : (
              <Link to="/login" style={{ display: "flex", alignItems: "center", border: "1px solid #8E1616", borderRadius: "24px", padding: "10px 24px", color: "#8E1616", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                Увійти
              </Link>
            )}

            <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(142, 22, 22, 0.2)", borderRadius: "24px", padding: "10px 20px", color: "#8E1616", textDecoration: "none", fontWeight: "600", fontSize: "14px", border: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Кошик
            </Link>
          </div>
        </div>

        {/* НИЖНЯ ПАНЕЛЬ З ГОДИНАМИ */}
        {!hideSlots && (
          <div style={{ borderTop: "1px solid rgba(142, 22, 22, 0.1)", padding: "12px 24px", display: "flex", gap: "12px", maxWidth: "1440px", margin: "0 auto", overflowX: "auto" }}>
            {timeSlots.map((slot, index) => {
              const isAccent = index === 0;
              return (
                <button
                  key={slot}
                  type="button"
                  style={{
                    display: "flex", alignItems: "center", gap: isAccent ? "6px" : "0",
                    backgroundColor: isAccent ? "rgba(142, 22, 22, 0.1)" : "transparent",
                    color: isAccent ? "#8E1616" : "#202124",
                    border: isAccent ? "none" : "1px solid rgba(142, 22, 22, 0.3)",
                    borderRadius: "20px", padding: "6px 16px", fontSize: "13px",
                    fontWeight: isAccent ? "700" : "400", cursor: "pointer"
                  }}
                >
                  {isAccent && "⚡ "}
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}
