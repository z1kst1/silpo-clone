import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

const timeSlots = [
  "до 69 хв",
  "18:00 - 19:30",
  "19:30 - 21:00",
  "21:00 - 22:30",
  "Завтра, 09:00 - 10:30",
  "Інший час",
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();

  const isProfilePage = location.pathname.startsWith("/profile");

  useEffect(() => {
    const savedUser = localStorage.getItem("silpo-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="kalpo-header">
      <div className="kalpo-header__inner">
        <div className="kalpo-header__left">
          <div className="kalpo-header__burger-wrap">
            <button
              type="button"
              className="kalpo-header__burger"
              onClick={toggleMenu}
            >
              ☰
            </button>

            {isMenuOpen && (
              <div className="kalpo-header__menu">
                <Link
                  to="/"
                  className="kalpo-header__menu-link"
                  onClick={closeMenu}
                >
                  Головна
                </Link>

                <Link
                  to="/catalog"
                  className="kalpo-header__menu-link"
                  onClick={closeMenu}
                >
                  Каталог
                </Link>

                <Link
                  to="/login"
                  className="kalpo-header__menu-link"
                  onClick={closeMenu}
                >
                  Увійти
                </Link>

                <Link
                  to="/cart"
                  className="kalpo-header__menu-link"
                  onClick={closeMenu}
                >
                  Кошик
                </Link>
              </div>
            )}
          </div>

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
            <span className="kalpo-header__delivery-icon">
              <img
                src="/images/figma/icons/location-header.svg"
                alt="Локація"
                width="24"
                height="24"
              />
            </span>

            <div>
              <div className="kalpo-header__delivery-title">Доставка</div>

              <div className="kalpo-header__delivery-text">
                Біла Церква, Таращанська 161
              </div>
            </div>
          </div>

          {user ? (
            <Link to="/profile" className="kalpo-header__action">
              <img
                src="/images/figma/icons/user-header.svg"
                alt=""
                width="16"
                height="16"
              />

              {user.name}
            </Link>
          ) : (
            <Link to="/login" className="kalpo-header__action">
              Увійти
            </Link>
          )}

          <Link
            to="/cart"
            className="kalpo-header__action kalpo-header__action--cart"
          >
            <img
              src="/images/figma/icons/cart-header.svg"
              alt=""
              width="16"
              height="16"
            />
            Кошик
          </Link>
        </div>
      </div>

      {!isProfilePage && (
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
      )}
    </header>
  );
}
