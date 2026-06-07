import { useState } from "react";
<<<<<<< HEAD
import { Link } from "react-router";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
=======
import { Link, useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/kalpo-home.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

>>>>>>> feature/reviews-orders
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
<<<<<<< HEAD

=======
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
>>>>>>> feature/reviews-orders
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

<<<<<<< HEAD
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
=======
  const isFormFilled =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
>>>>>>> feature/reviews-orders
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
<<<<<<< HEAD
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
=======
      const response = await api.post("/auth/register", {
        firstName: formData.name,
        lastName: "",
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      login({
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      setMessage("Реєстрація пройшла успішно!");
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Помилка при реєстрації.");
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
=======
    <section className="auth-modal-page">
      <div className="auth-modal-backdrop">
        <div className="auth-modal-card auth-modal-card--register">
          <Link to="/" className="auth-modal-close">
            ×
          </Link>
          <div className="auth-modal-logo">
            <img src="/images/figma/logo/logo.svg" alt="Kalpo" />
          </div>
          <h1 className="auth-modal-title">Реєстрація</h1>

          <form className="auth-modal-form" onSubmit={handleSubmit}>
            <label>
              Ім'я
              <input
                type="text"
                name="name"
                placeholder="Вкажіть ваше ім'я"
>>>>>>> feature/reviews-orders
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
<<<<<<< HEAD

            <label className="auth-label">
=======
            <label>
>>>>>>> feature/reviews-orders
              Email
              <input
                type="email"
                name="email"
<<<<<<< HEAD
                className="auth-input"
                placeholder="example@gmail.com"
=======
                placeholder="Вкажіть ваш email"
>>>>>>> feature/reviews-orders
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
=======
            <label>
              Пароль
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Вкажіть ваш пароль"
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
            <label>
              Підтвердження пароля
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Повторіть пароль"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "42px" }}
                />
                <span
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </span>
              </div>
            </label>
            <button type="submit" disabled={isSubmitting || !isFormFilled}>
>>>>>>> feature/reviews-orders
              {isSubmitting ? "Завантаження..." : "Зареєструватися"}
            </button>
          </form>

<<<<<<< HEAD
          {message && <p className="auth-success-message">{message}</p>}
          {error && <p className="auth-error-message">{error}</p>}

          <div className="auth-links">
            <Link to="/login">Вже маєш акаунт? Увійти</Link>
          </div>
=======
          {message && (
            <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
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
            Вже маєш акаунт? <Link to="/login">Увійти</Link>
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
