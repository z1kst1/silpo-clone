import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

const mockCategories = [
  { name: "Всі", count: 207, icon: "/images/figma/icons/categories/all.svg" },
  { name: "Добрі промо", count: 2, icon: "/images/figma/icons/categories/promo.svg" },
  { name: "Риба", count: 110, icon: "/images/figma/icons/categories/fish.svg" },
  { name: "Сири", count: 1, icon: "/images/figma/icons/categories/cheese.svg" },
  { name: "Готові страви і кулінарія", count: 28, icon: "/images/figma/icons/categories/food.svg" },
  { name: "Власні марки", count: 3, icon: "/images/figma/icons/categories/brands.svg" },
  { name: "Здорове харчування", count: 2, icon: "/images/figma/icons/categories/healthy.svg" },
  { name: "Бакалія і консерви", count: 13, icon: "/images/figma/icons/categories/cans.svg" },
  { name: "Заморожена продукція", count: 4, icon: "/images/figma/icons/categories/frozen.svg" }
];

// ПОВНИЙ список секцій фільтрів з макету Фігми
const filterSectionsList = [
  "Часто шукають",
  "Обробка риби",
  "Акційні пропозиції", // Цей пункт отримає спеціальну іконку
  "Основа продукту",
  "Сорт",
  "Смак",
  "Кількість одиниць",
  "Країна",
  "Особливі",
  "Спосіб обробки риби",
  "Підвид",
  "Додатковий смак",
  "Вид продукту",
  "Тип продукту",
  "Тип упаковки",
  "Ступінь обробки риби",
  "Властивості",
  "Фасування",
  "Вид риби",
  "Тип охолодження",
  "Частина риби",
  "Спосіб приготування страви",
  "Вид страви",
  "Торгова марка",
  "Масова частка жиру (%)",
  "Вид хліба та випічки",
  "Вид борошна",
  "Форма продукту",
  "Вид бакалії",
  "Основна сировина",
  "Вид снеків і чипсів",
  "Підвид снеків і чипсів",
  "Вид замороженої продукції",
  "Підвид замороженої продукції"
];

export default function CatalogPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "Всі";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilterSections, setOpenFilterSections] = useState([]);

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
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    );
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const currentSearch = searchQuery.toLowerCase().trim();

    if (currentSearch) {
      result = result.filter(
        (product) =>
          (product.title && product.title.toLowerCase().includes(currentSearch)) ||
          (product.category && product.category.toLowerCase().includes(currentSearch)) ||
          (product.description && product.description.toLowerCase().includes(currentSearch))
      );
    }

    if (selectedCategory !== "Всі") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center", minHeight: "100vh" }}><h2>Завантаження товарів...</h2></div>;
  }

  return (
    <>
      {/* МОДАЛЬНЕ ВІКНО ФІЛЬТРІВ */}
      {isFilterOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex"
        }}>
          <div style={{
            width: "360px", backgroundColor: "#fff", height: "100%",
            display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
              <h2 style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}>Фільтри</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>

            {/* Вміст, який скролиться */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filterSectionsList.map((section) => {
                const isOpen = openFilterSections.includes(section);
                const isPromo = section === "Акційні пропозиції";

                return (
                  <div key={section} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <div
                      onClick={() => toggleFilterSection(section)}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "20px 24px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#333"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Малюємо іконку, якщо це "Акційні пропозиції" */}
                        {isPromo && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e45e25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                          </svg>
                        )}
                        {section}
                      </div>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0 24px 20px", color: "#666", fontSize: "13px" }}>
                        Тут будуть опції для "{section}"...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
              <button
                onClick={() => setIsFilterOpen(false)}
                style={{
                  width: "100%", padding: "14px", backgroundColor: "#2b56e8", color: "#fff",
                  borderRadius: "24px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer"
                }}
              >
                Показати результати
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }} onClick={() => setIsFilterOpen(false)}></div>
        </div>
      )}

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <div style={{ backgroundColor: "#F5E6BE", minHeight: "100vh", paddingBottom: "60px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>

          <div style={{ fontSize: "12px", color: "#666", marginBottom: "24px" }}>
            <Link to="/" style={{ color: "#666", textDecoration: "none" }}>Головна</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#000" }}>{searchQuery ? "Пошук" : "Каталог"}</span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px", color: "#222" }}>
            {searchQuery ? `Результати пошуку “${searchQuery}”` : "Каталог товарів"}
          </h1>
          <p style={{ fontSize: "15px", color: "#222", marginBottom: "16px", fontWeight: "600" }}>Продукти</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
            {mockCategories.map((cat, idx) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 16px", borderRadius: "24px",
                    border: "1px solid #8b181b",
                    backgroundColor: isActive ? "#eedbb5" : "transparent",
                    color: "#8b181b", cursor: "pointer", fontSize: "13px", fontWeight: "600",
                    transition: "all 0.2s"
                  }}
                >
                  <img src={cat.icon} alt={cat.name} style={{ width: "16px", height: "16px", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
                  {cat.name}
                  <span style={{ color: "#8b181b", fontSize: "11px", fontWeight: "400", opacity: 0.7 }}>{cat.count}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div
              onClick={() => setIsFilterOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8b181b", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Фільтри
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8b181b", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              За замовчуванням
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="11" y2="14"></line><line x1="21" y1="18" x2="15" y2="18"></line>
              </svg>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>На жаль, товарів не знайдено</h2>
              <p>Спробуйте змінити пошуковий запит або обрати іншу категорію.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px", marginBottom: "48px" }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "20px" }}>
              <button style={{
                padding: "10px 48px", borderRadius: "24px", border: "1px solid #8b181b",
                backgroundColor: "transparent", color: "#8b181b", fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>
                Показати ще
              </button>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", fontSize: "14px", color: "#666", fontWeight: "500" }}>
                <span style={{ cursor: "pointer", fontSize: "12px" }}>❮</span>
                <span style={{ cursor: "pointer", color: "#8b181b", fontWeight: "700" }}>1</span>
                <span style={{ cursor: "pointer" }}>2</span>
                <span>..</span>
                <span style={{ cursor: "pointer" }}>5</span>
                <span style={{ cursor: "pointer", fontSize: "12px" }}>❯</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
