import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../api/auth";
import "../styles/kalpo-home.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await forgotPassword({ email });
      setMessage("Інструкції для відновлення паролю відправлено на email.");
    } catch {
      setError("Не вдалося відправити запит. Спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-modal-page">
      <div className="auth-modal-backdrop">
        <div className="auth-modal-card">
          <Link to="/login" className="auth-modal-close">
            ×
          </Link>

          <div className="auth-modal-logo">
            <img src="/images/figma/logo/logo.svg" alt="Kalpo" />
          </div>

          <h1 className="auth-modal-title">Відновлення паролю</h1>

          <form className="auth-modal-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                placeholder="Введіть ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Завантаження..." : "Відновити пароль"}
            </button>
          </form>

          {message && <p className="auth-modal-success">{message}</p>}
          {error && <p className="auth-modal-error">{error}</p>}

          <p className="auth-modal-bottom">
            Повернутись до <Link to="/login">входу</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
