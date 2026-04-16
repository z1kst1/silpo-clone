import { Link } from "react-router";

const timeSlots = [
  "до 69 хв",
  "18:00 - 19:30",
  "19:30 - 21:00",
  "21:00 - 22:30",
  "Завтра, 09:00 - 10:30",
  "Інший час",
];

export default function Header() {
  return (
    <header className="kalpo-header">
      <div className="kalpo-header__inner">
        <div className="kalpo-header__left">
          <button type="button" className="kalpo-header__burger">
            ☰
          </button>

          <Link to="/" className="kalpo-header__logo-link">
            <img
              src="/images/figma/logo/logo.svg"
              alt="Kalpo"
              className="kalpo-header__logo-image"
            />
          </Link>

          <Link to="/catalog" className="kalpo-header__catalog">
            Всі товари
          </Link>
        </div>

        <div className="kalpo-header__search">
          <input type="text" placeholder="Я шукаю..." />
        </div>

        <div className="kalpo-header__right">
          <div className="kalpo-header__delivery">
            <span className="kalpo-header__delivery-icon">⌖</span>
            <div>
              <div className="kalpo-header__delivery-title">Доставка</div>
              <div className="kalpo-header__delivery-text">
                Біла Церква, Таращанська 161
              </div>
            </div>
          </div>

          <Link to="/login" className="kalpo-header__action">
            Увійти
          </Link>

          <Link
            to="/cart"
            className="kalpo-header__action kalpo-header__action--cart"
          >
            Кошик
          </Link>
        </div>
      </div>

      <div className="kalpo-header__slots">
        {timeSlots.map((slot, index) => (
          <button
            key={slot}
            type="button"
            className={`kalpo-header__slot-button ${
              index === 0 ? "kalpo-header__slot-button--accent" : ""
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </header>
  );
}
