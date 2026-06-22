import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/kalpo-home.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormFilled =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  // ✅ Валідація формату email
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  // ✅ Мінімальна довжина паролю — 6 символів
  const isPasswordLongEnough = formData.password.length >= 6;
  const isPasswordMatch =
    formData.confirmPassword.length === 0 ||
    formData.password === formData.confirmPassword;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!isEmailValid) {
      setError("Введіть коректний email, наприклад example@gmail.com");
      return;
    }

    if (!isPasswordLongEnough) {
      setError("Пароль має містити щонайменше 6 символів.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.name,
        lastName: "",
        email: formData.email,
        password: formData.password,
      };

      const response = await api.post("/auth/register", payload);
      const data = response.data;

      // ✅ Підтримка нового формату відповіді від бекенду
      // Ярослав повертає accessToken + refreshToken
      // Старий формат повертав просто token
      const accessToken = data.accessToken || data.token;
      const refreshToken = data.refreshToken;

      // Зберігаємо refreshToken для автоматичного оновлення сесії
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Зберігаємо через AuthContext
      login(
        data.user || { email: formData.email, firstName: formData.name, name: formData.name },
        accessToken
      );

      setMessage("Реєстрація пройшла успішно!");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            "Помилка при реєстрації."
        );
      } else {
        setError("Не вдалося підключитися до сервера або виникла помилка.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Вкажіть ваш email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {formData.email.length > 0 && !isEmailValid && (
                <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  Некоректний формат email
                </span>
              )}
            </label>

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
              {formData.password.length > 0 && !isPasswordLongEnough && (
                <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  Щонайменше 6 символів
                </span>
              )}
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
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
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
              {!isPasswordMatch && (
                <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  Паролі не співпадають
                </span>
              )}
            </label>

            <button type="submit" disabled={isSubmitting || !isFormFilled || !isEmailValid || !isPasswordLongEnough || !isPasswordMatch}>
              {isSubmitting ? "Завантаження..." : "Зареєструватися"}
            </button>
          </form>

          {message && (
            <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
          )}
          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
          )}

          <p className="auth-modal-bottom">
            Вже маєш акаунт? <Link to="/login">Увійти</Link>
          </p>

          <button type="button" className="auth-modal-help">
            Допомога
          </button>
        </div>
      </div>
    </section>
  );
}
