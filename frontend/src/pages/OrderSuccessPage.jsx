import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Якщо потрапили сюди без замовлення — редірект на головну
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000); // автоматичний редірект через 10 секунд
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        backgroundColor: "#F5E6BE",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "32px",
          padding: "60px 48px",
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
        }}
      >
        {/* Іконка успіху */}
        <div
          style={{
            width: "96px",
            height: "96px",
            backgroundColor: "#f0fdf4",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px auto",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#202124",
            margin: "0 0 16px 0",
          }}
        >
          Замовлення оформлено!
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#555",
            lineHeight: "1.6",
            margin: "0 0 12px 0",
          }}
        >
          Дякуємо за покупку в Kalpo. Ми вже обробляємо ваше замовлення і
          зв'яжемося з вами найближчим часом.
        </p>

        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 40px 0" }}>
          Автоматичне перенаправлення на головну через 10 секунд...
        </p>

        {/* Кнопки */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <Link
            to="/catalog"
            style={{
              backgroundColor: "#8b181b",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "16px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "15px",
              display: "block",
            }}
          >
            Продовжити покупки
          </Link>
          <Link
            to="/profile"
            style={{
              backgroundColor: "#f5f5f5",
              color: "#202124",
              padding: "16px 32px",
              borderRadius: "16px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
              display: "block",
            }}
          >
            Переглянути замовлення у профілі
          </Link>
        </div>
      </div>
    </div>
  );
}
