import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/kalpo-home.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
              {isSubmitting ? "Завантаження..." : "Увійти"}
            </button>
          </form>

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
        </div>
      </div>
    </section>
  );
}
