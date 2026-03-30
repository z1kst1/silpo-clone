import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedValue = searchValue.trim();

    if (trimmedValue) {
      navigate(`/catalog?search=${encodeURIComponent(trimmedValue)}`);
    } else {
      navigate("/catalog");
    }
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-top__left">
          <span>Київ</span>
          <span>Доставка з 10:00 до 22:00</span>
        </div>

        <div className="header-top__right">
          <Link to="/login">Увійти</Link>
          <Link to="/register">Реєстрація</Link>
        </div>
      </div>

      <div className="header-main">
        <Link to="/" className="logo">
          Сільпо
        </Link>

        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Пошук товарів, категорій, брендів..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <button type="submit">Знайти</button>
        </form>

        <div className="header-buttons">
          <Link to="/catalog" className="header-btn header-btn--light">
            Каталог
          </Link>

          <Link to="/cart" className="header-btn header-btn--green">
            Кошик
          </Link>
        </div>
      </div>

      <nav className="header-nav">
        <Link to="/">Головна</Link>
        <Link to="/catalog">Продукти</Link>
        <a href="#">Акції</a>
        <a href="#">Доставка</a>
        <a href="#">Рецепти</a>
        <a href="#">Новинки</a>
      </nav>
    </header>
  );
}
