import { Link } from "react-router";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const currentPrice = Number(product.price) || 0;
  const priceInt = Math.floor(currentPrice);
  const priceDecimal = (currentPrice % 1).toFixed(2).substring(2);

  const cartItem = cartItems.find((item) => item.id === product.id);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product, 1);
  }

  function handleDecrease(e) {
    e.preventDefault();
    if (cartItem.quantity === 1) {
      removeFromCart(product.id);
    } else {
      decreaseQuantity(product.id);
    }
  }

  function handleIncrease(e) {
    e.preventDefault();
    increaseQuantity(product.id);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "grid",
        gridTemplateRows: "auto auto 1fr auto",
        width: "100%",
        height: "100%"
      }}
    >
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          padding: "0",
          aspectRatio: "1 / 1",
          display: "grid",
          placeItems: "center",
          overflow: "hidden"
        }}>
          <img
            src={product.image}
            alt={product.title || product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => e.target.style.display='none'}
          />
        </div>

        {product.badgeText && (
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            backgroundColor: product.badgeBg || "#ffdf00", color: product.badgeColor || "#000",
            padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "700"
          }}>
            {product.badgeText}
          </div>
        )}

        {cartItem ? (
          <div
            onClick={(e) => e.preventDefault()}
            style={{
              position: "absolute", bottom: "-10px", right: "12px",
              height: "32px", borderRadius: "16px",
              backgroundColor: "#1e40af", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: "0 8px", gap: "8px"
            }}
          >
            <button
              onClick={handleDecrease}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              -
            </button>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>{cartItem.quantity}</span>
            <button
              onClick={handleIncrease}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            style={{
              position: "absolute", bottom: "-10px", right: "12px",
              width: "32px", height: "32px", borderRadius: "50%",
              backgroundColor: "#fff", border: "1px solid #1e40af", color: "#1e40af",
              fontSize: "20px", display: "grid", placeItems: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            +
          </button>
        )}
      </div>

      <div style={{ padding: "0 4px", display: "grid", gridTemplateColumns: "auto auto 1fr", alignItems: "baseline", gap: "2px", marginBottom: "8px" }}>
        <span style={{ fontSize: "18px", fontWeight: "700" }}>{priceInt}</span>
        <span style={{ fontSize: "13px", fontWeight: "700" }}>.{priceDecimal}</span>
        <span style={{ fontSize: "12px", fontWeight: "500", marginLeft: "4px" }}>грн</span>
      </div>

      <p style={{
        fontSize: "13px", lineHeight: "1.4", color: "#333", margin: "0 4px 16px 4px",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>
        {product.title || product.name}
      </p>

      <div style={{ padding: "0 4px", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", fontSize: "12px", color: "#666" }}>
        <span>{product.weight || "100 г"}</span>
        <span style={{ display: "grid", gridTemplateColumns: "auto auto", alignItems: "center", gap: "4px" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#666"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          {product.rating || "4.0"}
        </span>
      </div>
    </Link>
  );
}
