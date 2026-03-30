import { Link } from "react-router";

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-info">
          <span className="auth-badge">Особистий кабінет</span>
          <h1>Вхід до акаунта</h1>
          <p>
            Увійдіть, щоб переглядати історію замовлень, зберігати товари в кошику
            та швидко оформлювати покупки.
          </p>

          <ul className="auth-benefits">
            <li>Швидке оформлення замовлень</li>
            <li>Доступ до історії покупок</li>
            <li>Зручне керування профілем</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Увійти</h2>

          <form className="auth-form">
            <label className="auth-label">
              Email
              <input
                type="email"
                placeholder="Введіть ваш email"
                className="auth-input"
              />
            </label>

            <label className="auth-label">
              Пароль
              <input
                type="password"
                placeholder="Введіть пароль"
                className="auth-input"
              />
            </label>

            <button type="submit" className="green-button auth-submit">
              Увійти
            </button>
          </form>

          <div className="auth-links">
            <a href="#">Забули пароль?</a>
            <p>
              Немає акаунта? <Link to="/register">Зареєструватися</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
