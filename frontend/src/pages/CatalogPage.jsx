import { useMemo, useState } from "react";
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

export default function CatalogPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

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
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];
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
  );
}
