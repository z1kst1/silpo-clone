import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, subtotal, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const deliveryCost = 79;
  const total = subtotal > 0 ? subtotal + deliveryCost : 0;

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: "#F5E6BE", minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", padding: "20px" }}>
        <div style={{ width: "160px", height: "160px", backgroundColor: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8b181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px", color: "#202124" }}>Ваш кошик порожній</h2>
        <p style={{ color: "#555", marginBottom: "32px", fontSize: "15px", textAlign: "center", maxWidth: "400px", lineHeight: "1.5" }}>
          Сюди потраплятимуть товари, які ви оберете в каталозі сайту Kalpo.
        </p>
        <Link to="/catalog" style={{ backgroundColor: "#8b181b", color: "#fff", padding: "14px 36px", borderRadius: "24px", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f9f6f0", minHeight: "calc(100vh - 80px)", paddingBottom: "80px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 40px" }}>

        <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "8px", color: "#202124", letterSpacing: "-0.5px" }}>Кошик</h1>
        <p style={{ color: "#666", marginBottom: "40px", fontSize: "15px" }}>Перевір обрані товари перед оформленням замовлення</p>

        <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>

          {/* СПИСОК ТОВАРІВ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
            {cartItems.map((item) => {
              const itemPrice = Number(item.price) || 0;
              const itemTotal = itemPrice * item.quantity;
              const priceInt = Math.floor(itemTotal);
              const priceDecimal = (itemTotal % 1).toFixed(2).substring(2);

              return (
                <div key={item.id} style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.03)" }}>

                  <div style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1 }}>
                    <div style={{ width: "110px", height: "110px", borderRadius: "20px", backgroundColor: "#fff", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #f0f0f0", padding: "6px" }}>
                      <img src={item.image} alt={item.name || item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <Link to={`/product/${item.id}`} style={{ textDecoration: "none" }}>
                          <h3 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0", color: "#202124", lineHeight: "1.3" }}>{item.name || item.title}</h3>
                        </Link>
                        <span style={{ color: "#777", fontSize: "14px", fontWeight: "500" }}>{item.price} грн / шт</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
                        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: "14px", padding: "4px 8px", border: "1px solid #e8e8e8" }}>
                          <button
                            onClick={() => item.quantity === 1 ? removeFromCart(item.id) : decreaseQuantity(item.id)}
                            style={{ width: "32px", height: "32px", border: "none", background: "none", fontSize: "20px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124" }}
                          >−</button>
                          <span style={{ fontSize: "16px", fontWeight: "700", width: "36px", textAlign: "center", color: "#202124" }}>{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            style={{ width: "32px", height: "32px", border: "none", background: "none", fontSize: "20px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", color: "#202124" }}
                          >+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: "700", fontSize: "14px", cursor: "pointer", padding: "0" }}>
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#202124", textAlign: "right", minWidth: "140px" }}>
                    <span>{priceInt}</span>
                    <span style={{ fontSize: "16px" }}>.{priceDecimal}</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", marginLeft: "4px" }}>грн</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ПІДСУМОК */}
          <div style={{ width: "400px", backgroundColor: "#fff", borderRadius: "32px", padding: "36px", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)", position: "sticky", top: "40px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 28px 0", color: "#202124" }}>Ваше замовлення</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#555", fontSize: "15px", fontWeight: "500" }}>
                <span>Сума товарів</span>
                <span style={{ color: "#202124", fontWeight: "700", fontSize: "16px" }}>{subtotal.toFixed(2)} грн</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#555", fontSize: "15px", fontWeight: "500" }}>
                <span>Доставка</span>
                <span style={{ color: "#202124", fontWeight: "700", fontSize: "16px" }}>{deliveryCost.toFixed(2)} грн</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f0f0f0", marginBottom: "24px" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
              <span style={{ fontSize: "18px", color: "#202124", fontWeight: "600" }}>Разом</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#202124" }}>{total.toFixed(2)} грн</span>
            </div>

            {/* ✅ Кнопка веде на /checkout */}
            <button
              onClick={() => navigate("/checkout")}
              style={{ width: "100%", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "20px", padding: "18px", fontSize: "16px", fontWeight: "750", cursor: "pointer", marginBottom: "20px" }}
            >
              Оформити замовлення
            </button>

            <div style={{ textAlign: "center" }}>
              <Link to="/catalog" style={{ color: "#10b981", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
                Продовжити покупки
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
