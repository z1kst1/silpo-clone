import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const currentPrice = Number(product.price) || 0;
  const priceInt = Math.floor(currentPrice);
  const priceDecimal = (currentPrice % 1).toFixed(2).substring(2);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* КАРТИНКА */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            aspectRatio: "1 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="m3 9 4-4 4 4 4-4 4 4" />
                <path d="M3 15h18" />
              </svg>
            </div>
          )}
        </div>

        {product.badgeText && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: product.badgeBg || "#ffdf00",
              color: product.badgeColor || "#000",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: "700",
            }}
          >
            {product.badgeText}
          </div>
        )}

        {/* КНОПКА ДОДАТИ */}
        <button
          onClick={handleAdd}
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "12px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: added ? "#22c55e" : "#fff",
            border: `1px solid ${added ? "#22c55e" : "#1e40af"}`,
            color: added ? "#fff" : "#1e40af",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s",
          }}
        >
          {added ? "✓" : "+"}
        </button>
      </div>

      {/* ТЕКСТ */}
      <div style={{ padding: "0 4px" }}>
        {/* НАЗВА — тепер ПЕРША і завжди видима */}
        <p
          style={{
            fontSize: "13px",
            lineHeight: "1.4",
            marginBottom: "8px",
            color: "#222",
            fontWeight: "500",
            minHeight: "36px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </p>

        {/* ЦІНА */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#111" }}>
            {priceInt}
          </span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>
            .{priceDecimal}
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "500",
              marginLeft: "4px",
              color: "#111",
            }}
          >
            грн
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <span>{product.weight || ""}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {product.rating || "4.0"}
          </span>
        </div>
      </div>

      {/* TOAST СПОВІЩЕННЯ */}
      {added && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "#22c55e",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          ✓ {product.name} додано до кошика
        </div>
      )}
    </Link>
  );
}
