import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import api from "../api/api";
import { createCheckoutSession } from "../api/stripe";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const deliveryCost = 79;
  const total = subtotal + deliveryCost;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
    paymentMethod: "card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.phone || !form.address) {
      setError("Заповніть всі обов'язкові поля");
      return;
    }

    // ✅ Перевірка формату українського номера телефону
    // Приймає: +380XXXXXXXXX, 380XXXXXXXXX, 0XXXXXXXXX
    const phoneDigits = form.phone.replace(/[^\d]/g, "");
    const isPhoneValid =
      /^380\d{9}$/.test(phoneDigits) || /^0\d{9}$/.test(phoneDigits);
    if (!isPhoneValid) {
      setError("Введіть коректний номер телефону, наприклад +380501234567");
      return;
    }

    // ✅ Перевірка email лише якщо поле заповнене (воно не обов'язкове)
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Введіть коректний email або залиште поле порожнім");
      return;
    }

    if (cartItems.length === 0) {
      setError("Кошик порожній");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Поля приведені у відповідність до схеми Prisma Ярослава:
      // Order { total, address, status, paymentMethod, comment, items: OrderItem[] }
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name || item.title,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total: total,
        address: form.address,
        comment: form.comment,
        paymentMethod: form.paymentMethod,
      };

      // ✅ Якщо обрана "Картка онлайн" — створюємо замовлення зі статусом
      // "очікує оплати" і одразу перенаправляємо на Stripe Checkout.
      // Якщо готівка/термінал — як раніше, відразу підтверджуємо замовлення.
      if (form.paymentMethod === "card") {
        const order = await api.post("/orders", orderData);
        const orderId = order.data.id;

        const session = await createCheckoutSession({
          orderId,
          items: cartItems.map((item) => ({
            name: item.name || item.title,
            price: Number(item.price),
            quantity: item.quantity,
          })),
        });

        // Stripe Checkout сам редіректить на свою сторінку оплати.
        // Картку приймає лише ВІН (тестова картка 4242 4242 4242 4242),
        // дані картки ніколи не проходять через наш сервер.
        window.location.href = session.url;
        return;
      }

      // Готівка / термінал при отриманні — без оплати онлайн
      await api.post("/orders", orderData);
      await clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Помилка оформлення:", err);

      if (err.response?.status === 401) {
        setError("Увійдіть в акаунт, щоб оформити замовлення");
      } else {
        setError(
          err.response?.data?.error ||
            "Не вдалося оформити замовлення. Спробуйте ще раз."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Якщо кошик порожній — редірект
  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: "#F5E6BE", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "16px" }}>Кошик порожній</h2>
        <p style={{ color: "#555", marginBottom: "24px" }}>Додайте товари, щоб оформити замовлення</p>
        <Link to="/catalog" style={{ backgroundColor: "#8b181b", color: "#fff", padding: "14px 36px", borderRadius: "24px", textDecoration: "none", fontWeight: "700" }}>
          До каталогу
        </Link>
      </div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: "1px solid #e0e0e0", fontSize: "15px", outline: "none",
    backgroundColor: "#fafafa", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: "600",
    color: "#555", marginBottom: "6px",
  };

  return (
    <div style={{ backgroundColor: "#f9f6f0", minHeight: "100vh", paddingBottom: "60px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

        {/* ЗАГОЛОВОК */}
        <div style={{ marginBottom: "32px" }}>
          <Link to="/cart" style={{ color: "#8b181b", textDecoration: "none", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            ❮ Повернутись до кошика
          </Link>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#202124", margin: 0 }}>Оформлення замовлення</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

            {/* ЛІВА ЧАСТИНА — ФОРМА */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* КОНТАКТНІ ДАНІ */}
              <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 24px 0", color: "#202124" }}>
                  Контактні дані
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Ім'я *</label>
                    <input
                      type="text" name="firstName" value={form.firstName}
                      onChange={handleChange} placeholder="Олексій"
                      style={inputStyle} required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Прізвище</label>
                    <input
                      type="text" name="lastName" value={form.lastName}
                      onChange={handleChange} placeholder="Коваленко"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Телефон *</label>
                    <input
                      type="tel" name="phone" value={form.phone}
                      onChange={handleChange} placeholder="+380..."
                      style={inputStyle} required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="example@gmail.com"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* АДРЕСА ДОСТАВКИ */}
              <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 24px 0", color: "#202124" }}>
                  Адреса доставки
                </h2>
                <div>
                  <label style={labelStyle}>Адреса *</label>
                  <input
                    type="text" name="address" value={form.address}
                    onChange={handleChange} placeholder="вул. Хрещатик, 1, Київ"
                    style={inputStyle} required
                  />
                </div>
              </div>

              {/* СПОСІБ ОПЛАТИ */}
              <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 24px 0", color: "#202124" }}>
                  Спосіб оплати
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { value: "card", label: "Картка онлайн" },
                    { value: "cash", label: "Готівка при отриманні" },
                    { value: "terminal", label: "Термінал при отриманні" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "14px 16px", borderRadius: "12px", border: form.paymentMethod === option.value ? "2px solid #10b981" : "2px solid #e0e0e0", backgroundColor: form.paymentMethod === option.value ? "#f0fdf4" : "#fafafa" }}
                    >
                      <input
                        type="radio" name="paymentMethod" value={option.value}
                        checked={form.paymentMethod === option.value}
                        onChange={handleChange}
                        style={{ accentColor: "#10b981" }}
                      />
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#202124" }}>{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* ✅ Підказка про тестову оплату Stripe — щоб на демонстрації
                    було зрозуміло звідки взяти номер картки */}
                {form.paymentMethod === "card" && (
                  <div style={{ marginTop: "16px", padding: "14px 16px", backgroundColor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
                    <p style={{ fontSize: "13px", color: "#1e40af", margin: 0, lineHeight: "1.5" }}>
                      💳 Оплата через Stripe (тестовий режим). Для перевірки введіть
                      номер картки <strong>4242 4242 4242 4242</strong>, будь-яку
                      майбутню дату та будь-який CVC.
                    </p>
                  </div>
                )}
              </div>

              {/* КОМЕНТАР */}
              <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 24px 0", color: "#202124" }}>
                  Коментар до замовлення
                </h2>
                <textarea
                  name="comment" value={form.comment} onChange={handleChange}
                  placeholder="Додаткові побажання..."
                  style={{ ...inputStyle, height: "100px", resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

            </div>

            {/* ПРАВА ЧАСТИНА — ПІДСУМОК */}
            <div style={{ width: "380px", position: "sticky", top: "40px" }}>
              <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 24px 0", color: "#202124" }}>
                  Ваше замовлення
                </h2>

                {/* СПИСОК ТОВАРІВ */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", border: "1px solid #f0f0f0", overflow: "hidden", flexShrink: 0 }}>
                        <img src={item.image} alt={item.name || item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#202124", lineHeight: "1.3" }}>
                          {item.name || item.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888" }}>× {item.quantity}</div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#202124", whiteSpace: "nowrap" }}>
                        {(Number(item.price) * item.quantity).toFixed(2)} грн
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" }}>
                    <span>Сума товарів</span>
                    <span style={{ fontWeight: "600" }}>{subtotal.toFixed(2)} грн</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" }}>
                    <span>Доставка</span>
                    <span style={{ fontWeight: "600" }}>{deliveryCost.toFixed(2)} грн</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "800", color: "#202124", paddingTop: "8px", borderTop: "1px solid #f0f0f0" }}>
                    <span>Разом</span>
                    <span>{total.toFixed(2)} грн</span>
                  </div>
                </div>

                {error && (
                  <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", color: "#dc2626", fontSize: "14px", fontWeight: "500" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ width: "100%", backgroundColor: isSubmitting ? "#9ca3af" : "#10b981", color: "#fff", border: "none", borderRadius: "16px", padding: "16px", fontSize: "16px", fontWeight: "700", cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                  {isSubmitting
                    ? (form.paymentMethod === "card" ? "Перенаправлення на оплату..." : "Оформляємо...")
                    : (form.paymentMethod === "card" ? "Перейти до оплати" : "Підтвердити замовлення")}
                </button>

                <p style={{ fontSize: "12px", color: "#888", textAlign: "center", marginTop: "12px", lineHeight: "1.4" }}>
                  Натискаючи кнопку, ви погоджуєтесь з умовами використання сервісу
                </p>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
