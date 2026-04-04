import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useCart();

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
      <Link to="/" className="logo">
        Silpo
      </Link>

      <nav className="nav">
        <Link to="/">Головна</Link>
        <Link to="/catalog">Каталог</Link>
        <a href="#">Акції</a>
        <a href="#">Доставка</a>
      </nav>

      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Пошук товарів..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </form>

      <div className="user-actions">
        <Link to="/login" className="header-button header-button--light">
          Увійти
        </Link>

        <Link to="/cart" className="header-button header-button--green">
          Кошик ({cartCount})
        </Link>
      </div>
    </header>
  );
}
