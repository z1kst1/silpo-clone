<<<<<<< HEAD
import { useMemo, useState } from "react";
import { Link } from "react-router";

const initialCartItems = [
  {
    id: 1,
    name: "Яблука",
    price: 25,
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    quantity: 2,
  },
  {
    id: 2,
    name: "Молоко",
    price: 32,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Bottle_of_milk.jpg",
    quantity: 1,
  },
  {
    id: 3,
    name: "Банани",
    price: 40,
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    quantity: 3,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  function increaseQuantity(id) {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(id) {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
    );
  }

  function removeItem(id) {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);
=======
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
>>>>>>> feature/reviews-orders

  const delivery = cartItems.length > 0 ? 79 : 0;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-empty">
          <h1>Кошик порожній</h1>
          <p>
<<<<<<< HEAD
            Додай товари до кошика, щоб оформити замовлення та продовжити покупки.
          </p>

=======
            Додай товари до кошика, щоб оформити замовлення та продовжити
            покупки.
          </p>
>>>>>>> feature/reviews-orders
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
<<<<<<< HEAD
              <img src={item.image} alt={item.name} className="cart-item__image" />
=======
              <img
                src={item.image}
                alt={item.name}
                className="cart-item__image"
                onError={(e) => {
                  e.target.src = "/images/figma/icons/placeholder.svg";
                }}
              />
>>>>>>> feature/reviews-orders

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
<<<<<<< HEAD

                    <span>{item.quantity}</span>

=======
                    <span>{item.quantity}</span>
>>>>>>> feature/reviews-orders
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
<<<<<<< HEAD

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeItem(item.id)}
=======
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
>>>>>>> feature/reviews-orders
                  >
                    Видалити
                  </button>
                </div>
              </div>

              <div className="cart-item__total">
<<<<<<< HEAD
                {item.price * item.quantity} грн
=======
                {(item.price * item.quantity).toFixed(2)} грн
>>>>>>> feature/reviews-orders
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Ваше замовлення</h2>
<<<<<<< HEAD

          <div className="cart-summary__row">
            <span>Сума товарів</span>
            <strong>{subtotal} грн</strong>
          </div>

=======
          <div className="cart-summary__row">
            <span>Сума товарів</span>
            <strong>{subtotal.toFixed(2)} грн</strong>
          </div>
>>>>>>> feature/reviews-orders
          <div className="cart-summary__row">
            <span>Доставка</span>
            <strong>{delivery} грн</strong>
          </div>
<<<<<<< HEAD

          <div className="cart-summary__row cart-summary__row--total">
            <span>Разом</span>
            <strong>{total} грн</strong>
          </div>

          <button type="button" className="green-button cart-summary__button">
            Оформити замовлення
          </button>

=======
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
>>>>>>> feature/reviews-orders
          <Link to="/catalog" className="cart-summary__link">
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </section>
  );
}
