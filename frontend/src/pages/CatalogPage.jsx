import { useMemo, useState } from "react";
<<<<<<< HEAD
import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

=======
import { useSearchParams, Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

const filterSectionsList = [
  "Акційні пропозиції",
  "Основа продукту",
  "Сорт",
  "Смак",
  "Кількість одиниць",
  "Країна",
  "Особливі",
  "Тип продукту",
  "Тип упаковки",
];

>>>>>>> feature/reviews-orders
export default function CatalogPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

<<<<<<< HEAD
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
=======
  const searchQuery = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "Всі";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilterSections, setOpenFilterSections] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  // Категорії з реальних товарів
  const categories = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return [
      { name: "Всі", count: products.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count })),
    ];
  }, [products]);

  function handleCategoryClick(categoryName) {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(searchParams);
    if (categoryName === "Всі") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    setSearchParams(params);
  }

  function toggleFilterSection(sectionName) {
    setOpenFilterSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((n) => n !== sectionName)
        : [...prev, sectionName],
    );
>>>>>>> feature/reviews-orders
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];
<<<<<<< HEAD

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
=======
    const currentSearch = searchQuery.toLowerCase().trim();

    // Пошук по назві, категорії, опису
    if (currentSearch) {
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(currentSearch)) ||
          (p.category && p.category.toLowerCase().includes(currentSearch)) ||
          (p.description &&
            p.description.toLowerCase().includes(currentSearch)),
      );
    }

    // Фільтр по категорії
    if (selectedCategory !== "Всі") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Сортування
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div style={{ padding: "80px", textAlign: "center", minHeight: "100vh" }}>
        <h2>Завантаження товарів...</h2>
      </div>
    );
  }

  return (
    <>
      {/* ФІЛЬТРИ */}
      {isFilterOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
          }}
        >
          <div
            style={{
              width: "360px",
              backgroundColor: "#fff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <h2 style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}>
                Фільтри
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filterSectionsList.map((section) => {
                const isOpen = openFilterSections.includes(section);
                return (
                  <div
                    key={section}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <div
                      onClick={() => toggleFilterSection(section)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 24px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {section}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#666"
                        strokeWidth="2.5"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    {isOpen && (
                      <div
                        style={{
                          padding: "0 24px 20px",
                          color: "#666",
                          fontSize: "13px",
                        }}
                      >
                        Опції для "{section}"...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0" }}
            >
              <button
                onClick={() => setIsFilterOpen(false)}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#2b56e8",
                  color: "#fff",
                  borderRadius: "24px",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Показати результати ({filteredProducts.length})
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsFilterOpen(false)} />
        </div>
      )}

      <div
        style={{
          backgroundColor: "#F5E6BE",
          minHeight: "100vh",
          paddingBottom: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>
          {/* ХЛІБНІ КРИХТИ */}
          <div
            style={{ fontSize: "12px", color: "#666", marginBottom: "24px" }}
          >
            <Link to="/" style={{ color: "#666", textDecoration: "none" }}>
              Головна
            </Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#000" }}>
              {searchQuery ? "Пошук" : "Каталог"}
            </span>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "16px",
              color: "#222",
            }}
          >
            {searchQuery
              ? `Результати пошуку "${searchQuery}"`
              : "Каталог товарів"}
          </h1>

          {/* КАТЕГОРІЇ З РЕАЛЬНИХ ДАНИХ */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  border: "1px solid #8b181b",
                  backgroundColor:
                    selectedCategory === cat.name ? "#eedbb5" : "transparent",
                  color: "#8b181b",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {cat.name}
                <span style={{ fontSize: "11px", opacity: 0.7 }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* ФІЛЬТРИ + СОРТУВАННЯ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div
              onClick={() => setIsFilterOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#8b181b",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Фільтри
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "24px",
                border: "1px solid #8b181b",
                backgroundColor: "transparent",
                color: "#8b181b",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="default">За замовчуванням</option>
              <option value="price_asc">Ціна: від дешевих</option>
              <option value="price_desc">Ціна: від дорогих</option>
              <option value="rating">За рейтингом</option>
              <option value="name">За назвою</option>
            </select>
          </div>

          {/* ТОВАРИ */}
          {filteredProducts.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "60px 0", color: "#666" }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
                Товарів не знайдено
              </h2>
              <p>
                Спробуйте змінити пошуковий запит або обрати іншу категорію.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "24px",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
>>>>>>> feature/reviews-orders
  );
}
