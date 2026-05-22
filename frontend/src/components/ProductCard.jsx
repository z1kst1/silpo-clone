import { Link } from "react-router";

const FALLBACK_IMAGE = "https://via.placeholder.com/420x280?text=Kalpo+Product";

export default function ProductCard({ product }) {
  function handleImageError(event) {
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  return (
    <article className="product-card">
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

        <Link
          to={`/product/${product.id}`}
          className="product-card__title-link"
        >
          <h3 className="product-card__title">{product.name}</h3>
        </Link>

        <p className="product-card__description">
          {product.description?.length > 90
            ? `${product.description.slice(0, 90)}...`
            : product.description}
        </p>

        <div className="product-card__bottom">
          <p className="product-card__price">{product.price} грн</p>

          <Link
            to={`/product/${product.id}`}
            className="green-button product-card__button"
          >
            Переглянути товар
          </Link>
        </div>
      </div>
    </article>
  );
}
