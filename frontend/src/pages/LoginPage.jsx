import { useState } from "react";
<<<<<<< HEAD
import { Link } from "react-router";
import { loginUser } from "../api/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

=======
import { Link, useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/kalpo-home.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> feature/reviews-orders
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
<<<<<<< HEAD

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
=======
    setFormData((prev) => ({ ...prev, [name]: value }));
>>>>>>> feature/reviews-orders
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
<<<<<<< HEAD
      const data = await loginUser(formData);

      localStorage.setItem("silpo-user", JSON.stringify(data));
      setMessage("Вхід виконано успішно.");
    } catch {
      setError(
        "Бекенд для входу ще не підключений або виникла помилка авторизації."
      );
=======
      // Відправляємо дані на бекенд
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      // Зберігаємо через AuthContext
      login({
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      setMessage("Вхід виконано успішно!");
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Невірний email або пароль.");
      } else {
        setError("Не вдалося підключитися до сервера.");
      }
>>>>>>> feature/reviews-orders
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
<<<<<<< HEAD
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
=======
    <section className="auth-modal-page">
      <div className="auth-modal-backdrop">
        <div className="auth-modal-card">
          <Link to="/" className="auth-modal-close">
            ×
          </Link>
          <div className="auth-modal-logo">
            <img src="/images/figma/logo/logo.svg" alt="Kalpo" />
          </div>
          <h1 className="auth-modal-title">Вхід</h1>

          <form className="auth-modal-form" onSubmit={handleSubmit}>
            <label>
>>>>>>> feature/reviews-orders
              Email
              <input
                type="email"
                name="email"
<<<<<<< HEAD
                className="auth-input"
=======
>>>>>>> feature/reviews-orders
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
<<<<<<< HEAD

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
=======
            <label>
              Пароль
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Введіть пароль"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "42px" }}
                />
                <span
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </label>

            <button type="submit" disabled={isSubmitting}>
>>>>>>> feature/reviews-orders
              {isSubmitting ? "Завантаження..." : "Увійти"}
            </button>
          </form>

<<<<<<< HEAD
          {message && <p className="auth-success-message">{message}</p>}
          {error && <p className="auth-error-message">{error}</p>}

          <div className="auth-links">
            <Link to="/register">Ще не маєш акаунта? Зареєструватися</Link>
          </div>
=======
          <p className="auth-modal-bottom">
            <Link to="/forgot-password">Забули пароль?</Link>
          </p>
          {message && (
            <p
              style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}
            >
              {message}
            </p>
          )}
          {error && (
            <p
              className="auth-modal-error"
              style={{ color: "red", marginTop: "10px" }}
            >
              {error}
            </p>
          )}
          <p className="auth-modal-bottom">
            Ще не маєш акаунта? <Link to="/register">Зареєструватися</Link>
          </p>
          <button type="button" className="auth-modal-help">
            Допомога
          </button>
>>>>>>> feature/reviews-orders
        </div>
      </div>
    </section>
  );
}
