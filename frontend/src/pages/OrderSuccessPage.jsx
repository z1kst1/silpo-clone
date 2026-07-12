import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useCart } from "../context/CartContext";
import { verifyPaymentSession } from "../api/stripe";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");

  // ✅ Якщо є session_id — це повернення зі Stripe, треба підтвердити оплату.
  // Якщо немає — це звичайне замовлення (готівка/термінал), нічого перевіряти.
  const [status, setStatus] = useState(sessionId ? "checking" : "confirmed");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    async function verify() {
      try {
        const result = await verifyPaymentSession(sessionId);
        if (result.paid) {
          setStatus("confirmed");
          // clearCart окремо — щоб помилка очищення кошика
          // не перекривала успішну оплату
          try {
            await clearCart();
          } catch (cartErr) {
            console.warn("Кошик не очистився, але оплата пройшла:", cartErr);
          }
        } else {
          setStatus("failed");
          setError("Платіж не підтверджено Stripe. Гроші не списані.");
        }
      } catch (err) {
        console.error("Помилка перевірки оплати:", err);
        // Якщо помилка авторизації (401) — токен закінчився поки юзер
        // був на сторінці Stripe. Оплата могла пройти — просимо перевірити
        // пошту або звернутися до підтримки.
        if (err.response?.status === 401) {
          setError(
            "Сесія авторизації закінчилась. Якщо оплата пройшла — " +
            "ви отримаєте підтвердження на email. " +
            "Зверніться до підтримки якщо гроші списались.",
          );
        } else if (err.response?.status >= 500) {
          setError(
            "Помилка сервера при перевірці оплати. " +
            "Якщо гроші списались — зверніться до підтримки з номером замовлення.",
          );
        } else {
          setError("Не вдалося підтвердити оплату. Зверніться до підтримки.");
        }
        setStatus("failed");
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Автоматичний редірект на головну тільки після підтвердження
  useEffect(() => {
    if (status !== "confirmed") return;
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  const wrapperStyle = {
    backgroundColor: "#F5E6BE",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "24px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "32px",
    padding: "60px 48px",
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
  };

  if (status === "checking") {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <div
            style={{
              width: "64px",
              height: "64px",
              border: "4px solid #f0f0f0",
              borderTopColor: "#10b981",
              borderRadius: "50%",
              margin: "0 auto 24px auto",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#202124", margin: 0 }}>
            Перевіряємо оплату...
          </h1>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <div
            style={{
              width: "96px", height: "96px", backgroundColor: "#fef2f2",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 32px auto",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#202124", margin: "0 0 16px 0" }}>
            Оплату не підтверджено
          </h1>
          <p style={{ fontSize: "15px", color: "#666", margin: "0 0 32px 0" }}>
            {error || "Платіж не пройшов. Спробуйте ще раз або оберіть інший спосіб оплати."}
          </p>
          <Link
            to="/checkout"
            style={{ backgroundColor: "#8b181b", color: "#fff", padding: "16px 32px", borderRadius: "16px", textDecoration: "none", fontWeight: "700", fontSize: "15px", display: "block" }}
          >
            Спробувати ще раз
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#202124", margin: "0 0 16px 0" }}>
          {sessionId ? "Оплату підтверджено!" : "Замовлення оформлено!"}
        </h1>

        <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6", margin: "0 0 12px 0" }}>
          Дякуємо за покупку в Kalpo. Ми вже обробляємо ваше замовлення і
          зв'яжемося з вами найближчим часом.
        </p>

        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 40px 0" }}>
          Автоматичне перенаправлення на головну через 10 секунд...
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to="/catalog"
            style={{ backgroundColor: "#8b181b", color: "#fff", padding: "16px 32px", borderRadius: "16px", textDecoration: "none", fontWeight: "700", fontSize: "15px", display: "block" }}
          >
            Продовжити покупки
          </Link>
          <Link
            to="/profile"
            style={{ backgroundColor: "#f5f5f5", color: "#202124", padding: "16px 32px", borderRadius: "16px", textDecoration: "none", fontWeight: "600", fontSize: "15px", display: "block" }}
          >
            Переглянути замовлення у профілі
          </Link>
        </div>
      </div>
    </div>
  );
}
