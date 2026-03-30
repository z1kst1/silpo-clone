import { Link, useParams } from "react-router";
import { useMemo, useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.id === Number(id));

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [product]);

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function decreaseQuantity() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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

              <button type="button" className="green-button">
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
