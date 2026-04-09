import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

export default function CatalogPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortType, setSortType] = useState("default");

  const categories = [...new Set(products.map((product) => product.category))];

  function updateParams(nextSearch, nextCategories) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextCategories.length === 1) {
      params.set("category", nextCategories[0]);
    }

    setSearchParams(params);
  }

  function handleCategoryChange(category) {
    setSelectedCategories((prev) => {
      const nextCategories = prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category];

      updateParams(searchValue, nextCategories);
      return nextCategories;
    });
  }

  function handlePriceRangeChange(event) {
    setSelectedPriceRange(event.target.value);
  }

  function handleSortChange(event) {
    setSortType(event.target.value);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateParams(searchValue, selectedCategories);
  }

  function clearFilters() {
    setSearchValue("");
    setSelectedCategories([]);
    setSelectedPriceRange("all");
    setSortType("default");
    setSearchParams({});
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const currentSearch = searchValue.toLowerCase().trim();

    if (currentSearch) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(currentSearch) ||
          product.category.toLowerCase().includes(currentSearch) ||
          product.description.toLowerCase().includes(currentSearch)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (selectedPriceRange === "upTo50") {
      result = result.filter((product) => product.price <= 50);
    }

    if (selectedPriceRange === "from50To80") {
      result = result.filter(
        (product) => product.price > 50 && product.price <= 80
      );
    }

    if (selectedPriceRange === "from80") {
      result = result.filter((product) => product.price > 80);
    }

    if (sortType === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortType === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortType === "nameAsc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchValue, selectedCategories, selectedPriceRange, sortType]);

  return (
    <section className="catalog-page">
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="catalog-sidebar__top">
            <h3>Фільтри</h3>

            <button
              type="button"
              className="catalog-clear-button"
              onClick={clearFilters}
            >
              Очистити
            </button>
          </div>

          <form className="catalog-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Пошук у каталозі"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="catalog-search-input"
            />
            <button type="submit" className="green-button catalog-search-button">
              Знайти
            </button>
          </form>

          <div className="filter-group">
            <p className="filter-title">Категорії</p>

            {categories.map((category) => (
              <label key={category} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <p className="filter-title">Ціна</p>

            <label className="filter-label">
              <input
                type="radio"
                name="price"
                value="all"
                checked={selectedPriceRange === "all"}
                onChange={handlePriceRangeChange}
              />
              <span>Усі ціни</span>
            </label>

            <label className="filter-label">
              <input
                type="radio"
                name="price"
                value="upTo50"
                checked={selectedPriceRange === "upTo50"}
                onChange={handlePriceRangeChange}
              />
              <span>До 50 грн</span>
            </label>

            <label className="filter-label">
              <input
                type="radio"
                name="price"
                value="from50To80"
                checked={selectedPriceRange === "from50To80"}
                onChange={handlePriceRangeChange}
              />
              <span>50–80 грн</span>
            </label>

            <label className="filter-label">
              <input
                type="radio"
                name="price"
                value="from80"
                checked={selectedPriceRange === "from80"}
                onChange={handlePriceRangeChange}
              />
              <span>Від 80 грн</span>
            </label>
          </div>
        </aside>

        <div className="catalog-content">
          <div className="catalog-toolbar">
            <div className="section-title">
              <h1>Каталог товарів</h1>
              <p>Обирай продукти швидко та зручно</p>
            </div>

            <div className="catalog-sort">
              <label htmlFor="sort">Сортування</label>
              <select id="sort" value={sortType} onChange={handleSortChange}>
                <option value="default">За замовчуванням</option>
                <option value="priceAsc">Спочатку дешевші</option>
                <option value="priceDesc">Спочатку дорожчі</option>
                <option value="nameAsc">За назвою</option>
              </select>
            </div>
          </div>

          {selectedCategories.length > 0 && (
            <div className="catalog-active-filters">
              {selectedCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="catalog-chip"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category} ×
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="catalog-empty">
              <h2>Завантаження товарів...</h2>
              <p>Зачекай кілька секунд, дані підтягуються.</p>
            </div>
          ) : (
            <>
              <p className="catalog-results-count">
                Знайдено товарів: <strong>{filteredProducts.length}</strong>
              </p>

              {filteredProducts.length === 0 ? (
                <div className="catalog-empty">
                  <h2>Нічого не знайдено</h2>
                  <p>Спробуй змінити пошук або очистити фільтри.</p>
                </div>
              ) : (
                <div className="catalog-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
