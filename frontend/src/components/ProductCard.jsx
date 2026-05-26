import { Link } from "react-router";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const currentPrice = Number(product.price) || 0;
  const priceInt = Math.floor(currentPrice);
  const priceDecimal = (currentPrice % 1).toFixed(2).substring(2);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product, 1);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", width: "100%" }}
    >
      {/* 1. БЛОК З КАРТИНКОЮ (тепер без відступів) */}
      <div style={{ position: "relative", marginBottom: "20px" }}>

        {/* Сам білий квадрат з рибою */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          padding: "0", // ПРИБРАЛИ БІЛУ РАМКУ!
          aspectRatio: "1 / 1",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden" // Обрізає краї, якщо картинка виходить за рамки
        }}>
          <img
            src={product.image}
            alt={product.title || product.name}
            // objectFit: "cover" заповнює весь простір квадрата картинкою
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => e.target.style.display='none'}
          />
        </div>

        {/* Бейджик знижки */}
        {product.badgeText && (
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            backgroundColor: product.badgeBg || "#ffdf00", color: product.badgeColor || "#000",
            padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "700"
          }}>
            {product.badgeText}
          </div>
        )}

        {/* Кнопка "Плюс" (винесена окремо, щоб гарно звисати знизу) */}
        <button
          onClick={handleAdd}
          style={{
            position: "absolute", bottom: "-10px", right: "12px",
            width: "32px", height: "32px", borderRadius: "50%",
            backgroundColor: "#fff", border: "1px solid #1e40af", color: "#1e40af",
            fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          +
        </button>
      </div>

      {/* 2. НИЖНЯ ЧАСТИНА (Текст) */}
      <div style={{ padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "8px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700" }}>{priceInt}</span>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>.{priceDecimal}</span>
          <span style={{ fontSize: "12px", fontWeight: "500", marginLeft: "4px" }}>грн</span>
        </div>

        <p style={{
          fontSize: "13px", lineHeight: "1.4", marginBottom: "16px", color: "#333",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {product.title || product.name}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#666" }}>
          <span>{product.weight || "100 г"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#666"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            {product.rating || "4.0"}
          </span>
        </div>
      </div>
    </Link>
  );
}
