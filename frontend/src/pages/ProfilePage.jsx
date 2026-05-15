import "../styles/kalpo-home.css";

export default function ProfilePage() {
  const savedUser = JSON.parse(localStorage.getItem("silpo-user"));

  const user = {
    name:
      `${savedUser?.user?.firstName || ""} ${savedUser?.user?.lastName || ""}`.trim() ||
      "Користувач",

    email: savedUser?.user?.email || savedUser?.email || "Email не вказаний",

    phone: savedUser?.user?.phone || "Телефон не вказаний",
  };

  return (
    <section className="profile-page">
      <div className="profile-shell">
        <aside className="profile-sidebar">
          <nav className="profile-menu">
            <button className="profile-menu__item profile-menu__item--active">
              ⌂ Профіль
            </button>
            <button className="profile-menu__item">♡ Мої дані</button>
            <button className="profile-menu__item">♢ Безпека</button>
            <button className="profile-menu__item">⌖ Адреси</button>
            <button className="profile-menu__item">▣ Історія покупок</button>
          </nav>

          <button className="profile-help-button">♧ Допомога</button>
        </aside>

        <main className="profile-main">
          <h1 className="profile-title">Профіль</h1>
          <p className="profile-subtitle">
            Керуйте своїми даними, адресами та замовленнями
          </p>

          <section className="profile-welcome-card">
            <div className="profile-user">
              <div className="profile-avatar">●</div>

              <div>
                <h2>Вітаємо, {user.name}! 👋</h2>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
            </div>

            <button className="profile-red-button">✎ Редагувати профіль</button>
          </section>

          <div className="profile-grid">
            <section className="profile-block">
              <h3>♡ Мої дані</h3>
              <p className="profile-block__hint">
                Особиста інформація та контакти
              </p>

              <div className="profile-row">
                <span>Ім’я</span>
                <b>{user.name}</b>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <b>{user.email}</b>
              </div>

              <div className="profile-row">
                <span>Телефон</span>
                <b>{user.phone}</b>
              </div>

              <button className="profile-link-button">
                Переглянути всі дані ›
              </button>
            </section>

            <section className="profile-block">
              <h3>⌖ Адреси</h3>
              <p className="profile-block__hint">Ваші адреси доставки</p>

              <div className="profile-row profile-row--address">
                <span>Основна адреса</span>
                <b>
                  вул. Таращанська, 161,
                  <br />
                  Біла Церква, 09100
                </b>
              </div>

              <button className="profile-outline-button">
                ＋ Додати адресу
              </button>
            </section>

            <section className="profile-block">
              <h3>▣ Історія покупок</h3>
              <p className="profile-block__hint">Ваші замовлення та покупки</p>

              <div className="profile-order">
                <span>Замовлення №1256</span>
                <span>12.05.2024</span>
                <b>1 238 ₴</b>
              </div>

              <div className="profile-order">
                <span>Замовлення №1189</span>
                <span>03.05.2024</span>
                <b>856 ₴</b>
              </div>

              <div className="profile-order">
                <span>Замовлення №1123</span>
                <span>27.04.2024</span>
                <b>1 459 ₴</b>
              </div>

              <button className="profile-link-button">
                Переглянути всі замовлення ›
              </button>
            </section>

            <section className="profile-block">
              <h3>♢ Безпека</h3>
              <p className="profile-block__hint">
                Налаштування безпеки облікового запису
              </p>

              <div className="profile-security-row">Змінити пароль ›</div>
              <div className="profile-security-row">Прив’язані пристрої ›</div>
              <div className="profile-security-row">
                Підтвердження email <span>Підтверджено ✓</span>
              </div>

              <button className="profile-link-button">
                Налаштування безпеки ›
              </button>
            </section>
          </div>

          <section className="profile-promo">
            <div className="profile-promo__icon">🍎</div>
            <div>
              <h3>Більше переваг з Kalpo</h3>
              <p>
                Слідкуйте за акціями, отримуйте персональні пропозиції та
                замовляйте разом з нами!
              </p>
            </div>

            <button className="profile-red-button">♡ Перейти до акцій</button>
          </section>
        </main>
      </div>
    </section>
  );
}
