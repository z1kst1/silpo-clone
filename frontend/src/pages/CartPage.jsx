import { Link } from "react-router";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  const delivery = cartItems.length > 0 ? 79 : 0;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-empty">
          <h1>Кошик порожній</h1>
          <p>
            Додай товари до кошика, щоб оформити замовлення та продовжити
            покупки.
          </p>
          <Link to="/catalog" className="green-button">
            Перейти до каталогу
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="section-title">
        <h1>Кошик</h1>
        <p>Перевір обрані товари перед оформленням замовлення</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-item__image"
                onError={(e) => {
                  e.target.src = "/images/figma/icons/placeholder.svg";
                }}
              />

              <div className="cart-item__content">
                <h3>{item.name}</h3>
                <p className="cart-item__price">{item.price} грн / шт</p>

                <div className="cart-item__actions">
                  <div className="quantity-box">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>

              <div className="cart-item__total">
                {(item.price * item.quantity).toFixed(2)} грн
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Ваше замовлення</h2>
          <div className="cart-summary__row">
            <span>Сума товарів</span>
            <strong>{subtotal.toFixed(2)} грн</strong>
          </div>
          <div className="cart-summary__row">
            <span>Доставка</span>
            <strong>{delivery} грн</strong>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Разом</span>
            <strong>{total.toFixed(2)} грн</strong>
          </div>
          <Link
            to="/checkout"
            className="green-button cart-summary__button"
            style={{
              display: "block",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Оформити замовлення
          </Link>
          <Link to="/catalog" className="cart-summary__link">
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </section>
  );
}
