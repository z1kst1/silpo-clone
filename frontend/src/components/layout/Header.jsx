import { Link } from "react-router";

export default function Header() {
  return (
    <header className="kalpo-header">
      <div className="kalpo-header__inner">
        <div className="kalpo-header__left">
          <button className="kalpo-header__burger" type="button">
            ☰
          </button>

          <Link to="/" className="kalpo-header__logo">
            Kalpo
          </Link>

          <button className="kalpo-header__catalog" type="button">
            Всі товари
          </button>
        </div>

        <div className="kalpo-header__search">
          <input type="text" placeholder="Я шукаю..." />
        </div>

        <div className="kalpo-header__right">
          <div className="kalpo-header__delivery">
            <span className="kalpo-header__delivery-icon">📍</span>
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
    </header>
  );
}
