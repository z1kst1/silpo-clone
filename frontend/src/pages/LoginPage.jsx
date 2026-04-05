import { useState } from "react";
import { Link } from "react-router";
import { loginUser } from "../api/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setIsSubmitting(true);

    try {
      const data = await loginUser(formData);

      localStorage.setItem("silpo-user", JSON.stringify(data));
      setMessage("Вхід виконано успішно.");
    } catch {
      setError(
        "Бекенд для входу ще не підключений або виникла помилка авторизації."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-info">
          <span className="auth-badge">Особистий кабінет</span>
          <h1>Увійди в акаунт Silpo</h1>
          <p>
            Авторизуйся, щоб переглядати свої замовлення, зберігати товари та
            швидше оформлювати покупки.
          </p>

          <ul className="auth-benefits">
            <li>доступ до історії замовлень</li>
            <li>зручніше оформлення покупок</li>
            <li>швидкий доступ до профілю</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Вхід</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="green-button auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Завантаження..." : "Увійти"}
            </button>
          </form>

          {message && <p className="auth-success-message">{message}</p>}
          {error && <p className="auth-error-message">{error}</p>}

          <div className="auth-links">
            <Link to="/register">Ще не маєш акаунта? Зареєструватися</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
