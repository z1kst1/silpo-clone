import { useState, useEffect, useRef } from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import { Link } from "react-router";
import { toast } from "react-toastify";

export default function CartDrawer({ isOpen, onClose }) {
  const { products } = useProducts();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
  } = useCart();
  const [suggestions, setSuggestions] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);
  const [packaging, setPackaging] = useState("silpo");

  const packagingOptions = [
    {
      id: "silpo",
      label: "Фірмові пакети «Сільпо»",
      desc: "Біопакет з ручкою за 1.2 ₴, для риби/м'яса — 2.49 ₴",
    },
    {
      id: "eco",
      label: "Власні багаторазові сумки",
      desc: "Без додаткової плати — привеземо у ваших сумках, якщо вкажете кур'єру",
    },
    {
      id: "none",
      label: "Без пакування",
      desc: "Товари будуть передані без додаткових пакетів",
    },
  ];

  const scrollContainerRef = useRef(null);
  const offersScrollRef = useRef(null);

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

  // Рекомендації на основі категорій товарів у кошику.
  // Якщо кошик порожній — показуємо найвищі за рейтингом товари (бестселери).
  useEffect(() => {
    if (!isOpen || !products || products.length === 0) return;

    const cartProductIds = new Set(cartItems.map((item) => item.id));
    const cartCategories = new Set(cartItems.map((item) => item.category));

    let pool;

    if (cartCategories.size > 0) {
      // Спочатку товари з тих же категорій, що вже в кошику
      pool = products.filter(
        (p) => cartCategories.has(p.category) && !cartProductIds.has(p.id),
      );

      // Якщо в категоріях кошика замало товарів — доповнюємо найкращими за рейтингом
      if (pool.length < 6) {
        const fallback = products
          .filter((p) => !cartProductIds.has(p.id) && !pool.includes(p))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0));
        pool = [...pool, ...fallback].slice(0, 10);
      }

      // Сортуємо по рейтингу — найкращі товари з потрібних категорій спочатку
      pool = pool.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Кошик порожній — показуємо бестселери (найвищий рейтинг)
      pool = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setSuggestions(pool.slice(0, 6));
  }, [isOpen, products, cartItems]);

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

  const scrollOffersLeft = () => {
    if (offersScrollRef.current) {
      offersScrollRef.current.scrollBy({ left: -180, behavior: "smooth" });
    }
  };

  const scrollOffersRight = () => {
    if (offersScrollRef.current) {
      offersScrollRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Затемнення фону */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          cursor: "pointer",
          transition: "opacity 0.3s",
        }}
      />

      {/* Бокова панель */}
      <div
        style={{
          width: "480px",
          maxWidth: "100%",
          backgroundColor: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* ШАПКА (Фіксована) */}
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "#F5E6BE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{ fontSize: "22px", fontWeight: "700", color: "#202124" }}
          >
            Кошик
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#202124",
              padding: "0",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* ЄДИНА ЗОНА ПРОКРУТКИ (Білий і Бежевий блоки скроляться разом) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* БІЛА ЗОНА (Порожній кошик АБО Додані товари) */}
          <div
            style={{
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            {isEmpty ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 20px",
                }}
              >
                <img
                  src="/images/figma/cart/empty-bag.png"
                  alt="Порожній кошик"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "contain",
                    marginBottom: "20px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "6px",
                    color: "#202124",
                    textAlign: "center",
                  }}
                >
                  Поки що порожньо
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Але ми готові до зборупродуктів!
                </p>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#F5E6BE",
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#202124",
                            lineHeight: "1.3",
                          }}
                        >
                          {item.name || item.title}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            color: "#555",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ cursor: "pointer" }}
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            <line x1="9" y1="10" x2="15" y2="10"></line>
                            <line x1="12" y1="7" x2="12" y2="13"></line>
                          </svg>
                          <svg
                            onClick={() => removeFromCart(item.id)}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ cursor: "pointer" }}
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          marginTop: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "800",
                            color: "#202124",
                          }}
                        >
                          {item.price} грн
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#2652E5",
                            borderRadius: "8px",
                            padding: "4px 8px",
                            color: "#fff",
                          }}
                        >
                          <button
                            onClick={() =>
                              item.quantity === 1
                                ? removeFromCart(item.id)
                                : decreaseQuantity(item.id)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0",
                            }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              minWidth: "28px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity} шт
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* БЕЖЕВА ЗОНА З ПРОПОЗИЦІЯМИ (Тягнеться до кінця) */}
          <div
            style={{
              backgroundColor: "#F5E6BE",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              flex: 1,
            }}
          >
            {/* Слайдер товарів (без заголовка, тільки бліді стрілки) */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={scrollLeft}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={scrollRight}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={scrollContainerRef}
                className="kalpo-sidebar-scroll"
                style={{
                  display: "flex",
                  gap: "12px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  scrollBehavior: "smooth",
                  minHeight: "220px",
                  paddingBottom: "8px",
                }}
              >
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    style={{ minWidth: "140px", width: "140px" }}
                  >
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Пакування */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#202124",
                  }}
                >
                  Пакування
                </span>
                <span
                  onClick={() => setIsPackagingOpen((prev) => !prev)}
                  style={{
                    color: "#8b181b",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {isPackagingOpen ? "Згорнути" : "Обрати інше"}
                </span>
              </div>

              {isPackagingOpen && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  {packagingOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setPackaging(opt.id);
                        setIsPackagingOpen(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border:
                          packaging === opt.id
                            ? "2px solid #8b181b"
                            : "1px solid #ddd",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ fontWeight: "700", color: "#202124" }}>
                        {opt.label}
                      </div>
                      <div style={{ color: "#666", marginTop: "2px" }}>
                        {opt.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    backgroundColor: "#DFCCA6",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/images/figma/cart/package.svg"
                    alt="Пакування"
                    style={{
                      width: "44px",
                      height: "44px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "/images/figma/cart/empty-bag.png";
                    }}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: "#DFCCA6",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#202124",
                      lineHeight: "1.4",
                      fontWeight: "500",
                    }}
                  >
                    {packagingOptions.find((o) => o.id === packaging)?.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Пропозиції для вас */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#202124",
                  }}
                >
                  Пропозиції для вас
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={scrollOffersLeft}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={scrollOffersRight}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              <div
                ref={offersScrollRef}
                style={{
                  display: "flex",
                  gap: "12px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  scrollBehavior: "smooth",
                }}
              >
                <div
                  style={{
                    minWidth: "160px",
                    backgroundColor: "transparent",
                    border: "1px solid #8b181b",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#DFCCA6",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5 13.5C12.5 13.5 10 6 16 3"
                          stroke="#4A772F"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.5 11.5C6.5 11.5 7 5 14 3"
                          stroke="#4A772F"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="7" cy="16" r="5" fill="#8B181B" />
                        <circle cx="15" cy="18" r="5" fill="#8B181B" />
                      </svg>
                      <span
                        style={{
                          color: "#202124",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        -10%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#8b181b",
                        borderRadius: "50%",
                        marginTop: "6px",
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#202124",
                      marginTop: "auto",
                    }}
                  >
                    на онлайн чек
                  </span>
                </div>

                <div
                  style={{
                    minWidth: "160px",
                    backgroundColor: "transparent",
                    border: "1px solid #8b181b",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#DFCCA6",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5 13.5C12.5 13.5 10 6 16 3"
                          stroke="#4A772F"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.5 11.5C6.5 11.5 7 5 14 3"
                          stroke="#4A772F"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="7" cy="16" r="5" fill="#8B181B" />
                        <circle cx="15" cy="18" r="5" fill="#8B181B" />
                      </svg>
                      <span
                        style={{
                          color: "#202124",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        -10%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#8b181b",
                        borderRadius: "50%",
                        marginTop: "6px",
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#202124",
                      lineHeight: "1.4",
                      marginTop: "auto",
                    }}
                  >
                    Безкоштовний мобільний зв'язок Yezzz!
                  </span>
                </div>
              </div>
            </div>

            {/* Промокод */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#202124",
                  }}
                >
                  Промокод
                </span>
                <span
                  onClick={() => setIsPromoOpen((prev) => !prev)}
                  style={{
                    color: "#8b181b",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {isPromoOpen ? "Сховати" : "Додати"}
                </span>
              </div>
              {isPromoOpen ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введіть промокод"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => {
                      toast.info(
                        promoCode.trim()
                          ? "Такого промокоду не знайдено"
                          : "Введіть промокод",
                      );
                    }}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#8b181b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Застосувати
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "13px", color: "#444" }}>
                  До замовлення можна додати лише один промокод
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ПІДВАЛ З КНОПКОЮ ОФОРМЛЕННЯ (Фіксований) */}
        <div
          style={{
            backgroundColor: "#F5E6BE",
            padding: "16px 24px 24px 24px",
            flexShrink: 0,
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            onClick={() => setIsDetailsOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#202124" }}
            >
              Показати деталі
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isDetailsOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>

          {isDetailsOpen && !isEmpty && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "16px",
                padding: "12px 16px",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#202124",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  Товари ({cartItems.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                  шт.)
                </span>
                <span>{subtotal.toFixed(2)} грн</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#555",
                }}
              >
                <span>Доставка</span>
                <span>59.00 грн</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "700",
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  paddingTop: "8px",
                }}
              >
                <span>Разом</span>
                <span>{(subtotal + 59).toFixed(2)} грн</span>
              </div>
            </div>
          )}

          {isEmpty ? (
            <button
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#2652E5",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Додайте товарів на 499.00 грн
            </button>
          ) : (
            <Link
              to="/cart"
              onClick={onClose}
              style={{
                display: "block",
                width: "100%",
                padding: "16px",
                backgroundColor: "#2652E5",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Оформити замовлення на {subtotal.toFixed(2)} грн
            </Link>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "#555", lineHeight: "1.4" }}
            >
              Замовте ще на 999.00 грн - доставимо за 59 грн + 89 грн
              прискорення
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="1.5"
              style={{ flexShrink: 0, marginTop: "2px" }}
            >
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
