import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

const categories = [
  "Фрукти",
  "Овочі",
  "М'ясо",
  "Молочні продукти",
];

export default function HomePage() {
  const { products } = useProducts();
  const popularProducts = products.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1>Ласкаво просимо до Silpo</h1>
          <p>Найкращі продукти онлайн</p>

          <Link to="/catalog" className="green-button hero-button">
            Перейти до каталогу
          </Link>
        </div>
      </section>

      <section className="categories">
        <h2>Категорії</h2>

        <div className="category-list">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/catalog?category=${encodeURIComponent(category)}`}
              className="category-card category-card--link"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="products">
        <div className="section-title">
          <h2>Популярні товари</h2>
          <p>Товари, які найчастіше обирають користувачі</p>
        </div>

        <div className="product-grid">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
