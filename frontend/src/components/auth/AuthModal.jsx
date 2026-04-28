import { Link } from "react-router";

export default function AuthModal() {
  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-logo">
          <img src="/images/figma/logo/logo.svg" alt="Kalpo" />
        </div>

        <h2 className="auth-title">Вхід</h2>

        <label>Email</label>
        <input type="email" placeholder="Вкажіть ваш email" />

        <label>Пароль</label>
        <input type="password" placeholder="Вкажіть ваш пароль" />

        <button className="auth-button">Увійти</button>

        <p className="auth-link">
          Ще не маєш акаунта? <Link to="/register">Зареєструватися</Link>
        </p>

        <div className="auth-help">Допомога</div>
      </div>
    </div>
  );
}
