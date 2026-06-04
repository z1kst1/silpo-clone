import { useState } from "react";
import { Link } from "react-router";
import api from "../api/api"; // Імпортуємо наш налаштований Axios
import "../styles/kalpo-home.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      // Axios автоматично конвертує об'єкт у JSON і додає правильні заголовки
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // В Axios дані від бекенду лежать у властивості `data`
      const data = response.data;

      // 1. Зберігаємо токен (тепер він називається просто 'token', щоб інтерцептор його легко знаходив)
      localStorage.setItem("token", data.token);

      // 2. ЗБЕРІГАЄМО ЮЗЕРА
      if (data.user) {
        localStorage.setItem("silpo-user", JSON.stringify(data.user));
      } else {
        localStorage.setItem(
          "silpo-user",
          JSON.stringify({ email: formData.email, name: "Користувач" }),
        );
      }

      setMessage("Вхід виконано успішно! Перенаправлення...");

      // 3. ЖОРСТКЕ ПЕРЕНАПРАВЛЕННЯ
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } catch (err) {
      console.error(err);

      // Axios кладе відповідь з помилкою від сервера в err.response
      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            "Невірний email або пароль.",
        );
      } else {
        setError(
          "Не вдалося підключитися до сервера. Перевірте, чи працює бекенд.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
              Email
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
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
                  onClick={() => setShowPassword((prev) => !prev)}
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
              {isSubmitting ? "Завантаження..." : "Увійти"}
            </button>
          </form>

          <p className="auth-modal-bottom">
            <Link to="/forgot-password">Забули пароль?</Link>
          </p>
          {message && (
            <p
              className="auth-modal-success"
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
        </div>
      </div>
    </section>
  );
}
