import { Link } from "react-router";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x220/f5f5f5/7a1f16?text=Kalpo";

export default function ProductCard({ product }) {
  function handleImageError(event) {
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  return (
    <article className="product-card">
      {product.discount > 0 && (
        <span className="product-card__discount">-{product.discount}%</span>
      )}

      <Link to={`/product/${product.id}`} className="product-card__image-link">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          className="product-card__image"
          onError={handleImageError}
        />
      </Link>

      <div className="product-card__content">
        <p className="product-card__category">{product.category}</p>

        <Link to={`/product/${product.id}`} className="product-card__title-link">
          <h3 className="product-card__title">{product.name}</h3>
        </Link>

        <div className="product-card__price-row">
          <strong className="product-card__price">{product.price} грн</strong>

          {product.oldPrice && (
            <span className="product-card__old-price">{product.oldPrice} грн</span>
          )}
        </div>

        <div className="product-card__meta">
          <span>{product.weight}</span>
          <span>★ {product.rating}</span>
        </div>
      </div>

      <button type="button" className="product-card__add-button">
        +
      </button>
    </article>
  );
}
