import { Link } from "react-router";

export default function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-info">
          <span className="auth-badge">Новий користувач</span>
          <h1>Створення акаунта</h1>
          <p>
            Зареєструйтеся, щоб зручно оформлювати замовлення, керувати особистими
            даними та швидше купувати улюблені товари.
          </p>

          <ul className="auth-benefits">
            <li>Персональний кабінет користувача</li>
            <li>Збереження товарів у кошику</li>
            <li>Зручне повторне оформлення замовлень</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Реєстрація</h2>

          <form className="auth-form">
            <label className="auth-label">
              Ім’я
              <input
                type="text"
                placeholder="Введіть ваше ім’я"
                className="auth-input"
              />
            </label>

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
                placeholder="Створіть пароль"
                className="auth-input"
              />
            </label>

            <label className="auth-label">
              Підтвердження пароля
              <input
                type="password"
                placeholder="Повторіть пароль"
                className="auth-input"
              />
            </label>

            <button type="submit" className="green-button auth-submit">
              Зареєструватися
            </button>
          </form>

          <div className="auth-links">
            <p>
              Уже є акаунт? <Link to="/login">Увійти</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
