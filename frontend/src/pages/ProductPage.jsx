import { Link, useParams } from "react-router";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import useProducts from "../hooks/useProducts";

export default function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  const product = products.find((item) => Number(item.id) === Number(id));

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.category === product.category &&
          Number(item.id) !== Number(product.id)
      )
      .slice(0, 4);
  }, [product, products]);

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function decreaseQuantity() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, quantity);
  }

  if (loading) {
    return (
      <section className="product-page">
        <div className="product-not-found">
          <h1>Завантаження товару...</h1>
          <p>Зачекай кілька секунд, дані підтягуються.</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-page">
        <div className="product-not-found">
          <h1>Товар не знайдено</h1>
          <p>Можливо, такого товару немає або посилання було введено неправильно.</p>

          <Link to="/catalog" className="green-button">
            Повернутися до каталогу
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="product-page">
      <div className="product-details">
        <div className="product-details__image-box">
          <img
            src={product.image}
            alt={product.name}
            className="product-details__image"
          />
        </div>

        <div className="product-details__info">
          <p className="product-details__category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-details__weight">Упаковка: {product.weight}</p>
          <p className="product-details__description">{product.description}</p>

          <div className="product-details__buy">
            <div className="product-details__price">{product.price} грн</div>

            <div className="product-details__controls">
              <div className="quantity-box">
                <button type="button" onClick={decreaseQuantity}>
                  −
                </button>

                <span>{quantity}</span>

                <button type="button" onClick={increaseQuantity}>
                  +
                </button>
              </div>

              <button
                type="button"
                className="green-button product-details__button"
                onClick={handleAddToCart}
              >
                Додати в кошик
              </button>
            </div>
          </div>

          <div className="product-details__meta">
            <div className="product-meta-card">
              <h3>Доставка</h3>
              <p>Доступна доставка кур’єром та самовивіз.</p>
            </div>

            <div className="product-meta-card">
              <h3>Оплата</h3>
              <p>Оплата онлайн або при отриманні замовлення.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="related-products">
        <div className="section-title">
          <h2>Схожі товари</h2>
          <p>Інші товари з цієї категорії</p>
        </div>

        <div className="products-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
