import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/auth";
import "../styles/kalpo-home.css";

export default function RegisterPage() {
  const navigate = useNavigate();

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

      navigate("/profile");
    } catch {
      setError("Бекенд для реєстрації ще не підключений або виникла помилка.");
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
              Ім’я
              <input
                type="text"
                name="name"
                placeholder="Вкажіть ваше ім’я"
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
                    lineHeight: "1",
                    color: "#555",
                    userSelect: "none",
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
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "14px",
                    lineHeight: "1",
                    color: "#555",
                    userSelect: "none",
                  }}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </span>
              </div>
            </label>

            <button type="submit" disabled={isSubmitting || !isFormFilled}>
              {isSubmitting ? "Завантаження..." : "Зареєструватися"}
            </button>
          </form>

          {message && <p className="auth-modal-success">{message}</p>}
          {error && <p className="auth-modal-error">{error}</p>}

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
