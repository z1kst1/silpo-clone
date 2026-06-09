import { useState, useEffect, useRef } from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import { Link } from "react-router";

export default function CartDrawer({ isOpen, onClose }) {
  const { products } = useProducts();
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, subtotal } = useCart();
  const [suggestions, setSuggestions] = useState([]);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      const unique = [];
      const diverse = [];

      for (const item of shuffled) {
        if (!unique.includes(item.category)) {
          unique.push(item.category);
          diverse.push(item);
        }
        if (diverse.length === 6) break;
      }

      if (diverse.length < 6) {
        const left = shuffled.filter(i => !diverse.includes(i));
        diverse.push(...left.slice(0, 6 - diverse.length));
      }

      setSuggestions(diverse.sort(() => Math.random() - 0.5));
    }
  }, [isOpen, products]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <div
        onClick={onClose}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", cursor: "pointer", transition: "opacity 0.3s" }}
      />

      <div style={{ width: "480px", maxWidth: "100%", backgroundColor: "#fff", position: "relative", display: "flex", flexDirection: "column", height: "100%", boxShadow: "-8px 0 32px rgba(0,0,0,0.15)" }}>

        <div style={{ padding: "20px 24px", backgroundColor: "#F5E6BE", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "20px", fontWeight: "600", color: "#202124" }}>Кошик</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124", padding: "0" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>

          <div style={{ backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
            {isEmpty ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", minHeight: "280px" }}>
                <img src="/images/figma/cart/empty-bag.png" alt="Порожній кошик" style={{ width: "160px", height: "160px", objectFit: "contain", marginBottom: "20px" }} />
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px", color: "#202124", textAlign: "center" }}>Поки що порожньо</h3>
                <p style={{ fontSize: "14px", color: "#666", margin: 0, textAlign: "center" }}>Але ми готові до збору продуктів!</p>
              </div>
            ) : (
              <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ backgroundColor: "#F5E6BE", borderRadius: "16px", padding: "16px 24px", display: "flex", gap: "16px" }}>

                    <div style={{ width: "64px", height: "64px", flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#202124", lineHeight: "1.2" }}>
                          {item.name || item.title}
                        </span>
                        <div style={{ display: "flex", gap: "12px", color: "#555" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            <line x1="9" y1="10" x2="15" y2="10"></line>
                            <line x1="12" y1="7" x2="12" y2="13"></line>
                          </svg>
                          <svg onClick={() => removeFromCart(item.id)} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "12px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#202124" }}>
                          {item.price} грн
                        </span>
                        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#2652E5", borderRadius: "8px", padding: "4px 8px", color: "#fff" }}>
                          <button onClick={() => item.quantity === 1 ? removeFromCart(item.id) : decreaseQuantity(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "600", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>−</button>
                          <span style={{ fontSize: "13px", fontWeight: "700", minWidth: "36px", textAlign: "center" }}>{item.quantity} шт</span>
                          <button onClick={() => increaseQuantity(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "600", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: "#F4E4C4", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>

            <div style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", padding: "0 8px" }}>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#202124" }}>Рекомендовані товари</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={scrollLeft} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", backgroundColor: "#E6D5B0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button onClick={scrollRight} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", backgroundColor: "#F9EFD9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
              <div ref={scrollContainerRef} className="kalpo-sidebar-scroll" style={{ display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none", scrollBehavior: "smooth", padding: "0 8px 8px 8px" }}>
                {suggestions.map(item => (
                  <div key={item.id} style={{ minWidth: "120px", width: "120px" }}>
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: "#E8D3A8", padding: "20px", borderRadius: "16px", margin: "0 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#202124" }}>Пакування</span>
                <span style={{ color: "#8b181b", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Обрати інше</span>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "56px", height: "56px", backgroundColor: "#dcb98a", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                  <img src="/images/figma/cart/empty-bag.png" style={{ width: "32px", objectFit: "contain" }} />
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#444", lineHeight: "1.4" }}>
                  Зберемо замовлення в фірмові пакети «Kalpo». Для вагового візьмемо мінімум біопакетів з ручкою за 1.2 ₴. Для рибки та м'яса – зручні пакетики за 2.49 ₴.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#E8D3A8", padding: "20px", borderRadius: "16px", margin: "0 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#202124" }}>Пропозиції для вас</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ width: "28px", height: "28px", borderRadius: "8px", border: "none", backgroundColor: "#E6D5B0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button style={{ width: "28px", height: "28px", borderRadius: "8px", border: "none", backgroundColor: "#F9EFD9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none" }}>
                <div style={{ minWidth: "160px", border: "1px solid #d0a46b", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#E8D3A8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ backgroundColor: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#8b181b" }}>🍒</span> -10%
                    </div>
                    <div style={{ width: "6px", height: "6px", backgroundColor: "#8b181b", borderRadius: "50%", marginTop: "6px" }}></div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#202124" }}>на онлайн чек</span>
                </div>
                <div style={{ minWidth: "160px", border: "1px solid #d0a46b", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#E8D3A8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ backgroundColor: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#8b181b" }}>🍒</span> -10%
                    </div>
                    <div style={{ width: "6px", height: "6px", backgroundColor: "#8b181b", borderRadius: "50%", marginTop: "6px" }}></div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#202124" }}>Безкоштовний мобільний зв'язок</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#E8D3A8", padding: "20px", borderRadius: "16px", margin: "0 8px 8px 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#202124" }}>Промокод</span>
                <span style={{ color: "#8b181b", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Додати</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#444" }}>
                До замовлення можна додати лише один промокод
              </p>
            </div>

          </div>

        </div>

        <div style={{ backgroundColor: "#F4E4C4", padding: "16px 24px 24px 24px", flexShrink: 0 }}>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#202124" }}>Показати деталі</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </div>

          {isEmpty ? (
            <button style={{ width: "100%", padding: "14px", backgroundColor: "#2652E5", color: "#fff", border: "none", borderRadius: "16px", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>
              Додайте товарів на 499.00 грн
            </button>
          ) : (
            <Link to="/cart" onClick={onClose} style={{ display: "block", width: "100%", padding: "14px", backgroundColor: "#2652E5", color: "#fff", border: "none", borderRadius: "16px", fontWeight: "700", fontSize: "15px", cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
              Оформити замовлення на {subtotal.toFixed(2)} грн
            </Link>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginTop: "12px" }}>
            <span style={{ fontSize: "11px", color: "#555", lineHeight: "1.3" }}>
              Замовте ще на 999.00 грн - доставимо за 59 грн + 89 грн прискорення
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <circle cx="12" cy="8" r="1" fill="#555" stroke="none"></circle>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
