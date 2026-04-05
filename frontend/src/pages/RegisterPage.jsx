import { useState } from "react";
import { Link } from "react-router";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const data = await registerUser(payload);

      localStorage.setItem("silpo-user", JSON.stringify(data));
      setMessage("Реєстрація пройшла успішно.");
    } catch {
      setError(
        "Бекенд для реєстрації ще не підключений або виникла помилка створення акаунта."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-info">
          <span className="auth-badge">Новий акаунт</span>
          <h1>Створи акаунт Silpo</h1>
          <p>
            Після реєстрації ти зможеш швидше оформлювати замовлення, переглядати
            історію покупок і користуватися особистим кабінетом.
          </p>

          <ul className="auth-benefits">
            <li>збереження контактних даних</li>
            <li>доступ до історії замовлень</li>
            <li>зручніше оформлення покупок</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Реєстрація</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Ім’я
              <input
                type="text"
                name="name"
                className="auth-input"
                placeholder="Введіть ім’я"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="auth-label">
              Email
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="auth-label">
              Пароль
              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="Введіть пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="auth-label">
              Підтвердження пароля
              <input
                type="password"
                name="confirmPassword"
                className="auth-input"
                placeholder="Повторіть пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="green-button auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Завантаження..." : "Зареєструватися"}
            </button>
          </form>

          {message && <p className="auth-success-message">{message}</p>}
          {error && <p className="auth-error-message">{error}</p>}

          <div className="auth-links">
            <Link to="/login">Вже маєш акаунт? Увійти</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
