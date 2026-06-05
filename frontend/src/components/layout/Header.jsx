import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { user, logout } = useAuth(); // ← замість localStorage
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();

  const isProfilePage = location.pathname.startsWith("/profile");
  const isProductPage = location.pathname.startsWith("/product");
  const isCatalogPage = location.pathname.startsWith("/catalog");
  const isCategoriesPage = location.pathname.startsWith("/categories");
  const hideSlots =
    isProfilePage || isProductPage || isCatalogPage || isCategoriesPage;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsFocused(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const searchSuggestions =
    searchQuery.trim() === ""
      ? products.slice(0, 5)
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
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 40,
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
            padding: "16px 24px",
            maxWidth: "1440px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* БУРГЕР + ЛОГОТИП */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8E1616",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
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
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              {isMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    left: 0,
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    padding: "16px 0",
                    zIndex: 100,
                    minWidth: "200px",
                  }}
                >
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 24px",
                      color: "#202124",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    Головна
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 24px",
                      color: "#202124",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    Всі категорії
                  </Link>
                  <Link
                    to="/catalog"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 24px",
                      color: "#202124",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    Каталог товарів
                  </Link>
                  {user ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 24px",
                        color: "#8E1616",
                        background: "none",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      Вийти
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "12px 24px",
                        color: "#202124",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "15px",
                      }}
                    >
                      Увійти
                    </Link>
                  )}
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 24px",
                      color: "#202124",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    Кошик
                  </Link>
                </div>
              )}
            </div>
            <Link to="/">
              <img
                src="/images/figma/logo/logo.svg"
                alt="Kalpo"
                style={{ height: "32px", display: "block" }}
              />
            </Link>
          </div>

          {/* КНОПКА ВСІ ТОВАРИ */}
          <Link
            to="/categories"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #8E1616",
              borderRadius: "24px",
              padding: "10px 20px",
              color: "#8E1616",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              marginLeft: "24px",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Всі товари
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Link>

          {/* ПОШУК */}
          <div
            style={{
              flex: 1,
              margin: "0 24px",
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{ position: "relative", width: "100%", maxWidth: "500px" }}
            >
              <form
                onSubmit={handleSearchSubmit}
                style={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    color: "#8E1616",
                    zIndex: 2,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Я шукаю..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 44px",
                    borderRadius: "24px",
                    border: "none",
                    backgroundColor: "#FFFFFF",
                    outline: "none",
                    fontSize: "15px",
                    color: "#202124",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      padding: "4px",
                      cursor: "pointer",
                      color: "#8E1616",
                      zIndex: 2,
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </form>

              {isFocused && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    padding: "16px",
                    zIndex: 55,
                    maxHeight: "450px",
                    overflowY: "auto",
                  }}
                >
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((product) => (
                      <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        onClick={() => setIsFocused(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textDecoration: "none",
                          color: "inherit",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              flexShrink: 0,
                              overflow: "hidden",
                              border: "1px solid #eee",
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#333",
                              fontWeight: "500",
                            }}
                          >
                            {product.name}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: "700" }}>
                          {product.price} грн
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        textAlign: "center",
                        padding: "20px 0",
                      }}
                    >
                      Товарів за запитом "{searchQuery}" не знайдено
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ПРАВА ЧАСТИНА */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#8E1616",
                fontSize: "12px",
                marginRight: "16px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#202124",
                  }}
                >
                  Доставка
                </span>
                <span>Біла Церква, Таращанська 161</span>
              </div>
            </div>

            {user ? (
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #8E1616",
                  borderRadius: "24px",
                  padding: "10px 20px",
                  color: "#8E1616",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {user.firstName || user.name || "Профіль"}
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #8E1616",
                  borderRadius: "24px",
                  padding: "10px 24px",
                  color: "#8E1616",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Увійти
              </Link>
            )}

            <Link
              to="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(142,22,22,0.2)",
                borderRadius: "24px",
                padding: "10px 20px",
                color: "#8E1616",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Кошик
            </Link>
          </div>
        </div>

        {!hideSlots && (
          <div
            style={{
              borderTop: "1px solid rgba(142,22,22,0.1)",
              padding: "12px 24px",
              display: "flex",
              gap: "12px",
              maxWidth: "1440px",
              margin: "0 auto",
              overflowX: "auto",
            }}
          >
            {timeSlots.map((slot, index) => (
              <button
                key={slot}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: index === 0 ? "6px" : "0",
                  backgroundColor:
                    index === 0 ? "rgba(142,22,22,0.1)" : "transparent",
                  color: index === 0 ? "#8E1616" : "#202124",
                  border:
                    index === 0 ? "none" : "1px solid rgba(142,22,22,0.3)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: index === 0 ? "700" : "400",
                  cursor: "pointer",
                }}
              >
                {index === 0 && "⚡ "}
                {slot}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
