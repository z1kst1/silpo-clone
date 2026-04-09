import { Link } from "react-router";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__image-link">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
      </Link>

      <div className="product-card__content">
        <p className="product-card__category">{product.category}</p>

        <Link to={`/product/${product.id}`} className="product-card__title-link">
          <h3 className="product-card__title">{product.name}</h3>
        </Link>

        <p className="product-card__price">{product.price} грн</p>

        <div className="product-card__bottom">
          <Link to={`/product/${product.id}`} className="green-button">
            Переглянути товар
          </Link>
        </div>
      </div>
    </article>
  );
}
