import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

const mockCategories = [
  { name: "Всі", icon: "/images/figma/icons/categories/all.svg" },
  { name: "Добрі промо", icon: "/images/figma/icons/categories/promo.svg" },
  { name: "Риба", icon: "/images/figma/icons/categories/fish.svg" },
  { name: "Сири", icon: "/images/figma/icons/categories/cheese.svg" },
  { name: "Готові страви і кулінарія", icon: "/images/figma/icons/categories/food.svg" },
  { name: "Власні марки", icon: "/images/figma/icons/categories/brands.svg" },
  { name: "Здорове харчування", icon: "/images/figma/icons/categories/healthy.svg" },
  { name: "Бакалія і консерви", icon: "/images/figma/icons/categories/cans.svg" },
  { name: "Заморожена продукція", icon: "/images/figma/icons/categories/frozen.svg" },
];

const filterSectionsList = [
  "Часто шукають", "Обробка риби", "Акційні пропозиції", "Основа продукту",
  "Сорт", "Смак", "Кількість одиниць", "Країна", "Особливі",
  "Спосіб обробки риби", "Підвид", "Додатковий смак", "Вид продукту",
  "Тип продукту", "Тип упаковки", "Ступінь обробки риби", "Властивості",
  "Фасування", "Вид риби", "Тип охолодження", "Частина риби",
  "Спосіб приготування страви", "Вид страви", "Торгова марка",
];

// ✅ Маппінг сортування для бекенду
const SORT_OPTIONS = [
  { value: "default",    label: "За замовчуванням", sortBy: undefined,  order: undefined },
  { value: "price_asc",  label: "Ціна: від дешевих", sortBy: "price",   order: "asc" },
  { value: "price_desc", label: "Ціна: від дорогих",  sortBy: "price",   order: "desc" },
  { value: "name_asc",   label: "Назва: А-Я",         sortBy: "name",    order: "asc" },
];

function SkeletonCard() {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ width: "100%", height: "140px", backgroundColor: "#f0f0f0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
      <div style={{ height: "14px", backgroundColor: "#f0f0f0", borderRadius: "6px", width: "80%" }} />
      <div style={{ height: "14px", backgroundColor: "#f0f0f0", borderRadius: "6px", width: "50%" }} />
      <div style={{ height: "32px", backgroundColor: "#f0f0f0", borderRadius: "8px" }} />
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Всі");
  const [sortValue, setSortValue] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openFilterSections, setOpenFilterSections] = useState([]);
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

  const searchQuery = searchParams.get("search") || "";
  const currentSort = SORT_OPTIONS.find((o) => o.value === sortValue);

  // ✅ Серверна пагінація і фільтрація через useProducts
  const { products, loading, total, totalPages } = useProducts({
    page: currentPage,
    limit: 24,
    category: selectedCategory !== "Всі" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    sortBy: currentSort?.sortBy,
    order: currentSort?.order,
  });

  // Скидаємо сторінку при зміні фільтрів
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortValue]);

  function handleCategoryClick(categoryName) {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (categoryName === "Всі") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    setSearchParams(params);
  }

  function handleLocalSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
    } else {
      params.delete("search");
    }
    setCurrentPage(1);
    setSearchParams(params);
  }

  function clearSearch() {
    setLocalSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    setSearchParams(params);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getPageNumbers() {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      {/* МОДАЛЬНЕ ВІКНО ФІЛЬТРІВ */}
      {isFilterOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex" }}>
          <div style={{ width: "360px", backgroundColor: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
              <h2 style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}>Фільтри</h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filterSectionsList.map((section) => {
                const isOpen = openFilterSections.includes(section);
                return (
                  <div key={section} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <div onClick={() => setOpenFilterSections((prev) => isOpen ? prev.filter((s) => s !== section) : [...prev, section])} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                      {section}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0 24px 16px", color: "#888", fontSize: "13px" }}>
                        Опції будуть доступні після підключення бекенду
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0" }}>
              <button onClick={() => setIsFilterOpen(false)} style={{ width: "100%", padding: "14px", backgroundColor: "#8b181b", color: "#fff", borderRadius: "24px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                Показати результати ({total})
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsFilterOpen(false)}></div>
        </div>
      )}

      <div style={{ backgroundColor: "#F5E6BE", minHeight: "100vh", paddingBottom: "60px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>

          {/* ХЛІБНІ КРИХТИ */}
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "24px" }}>
            <Link to="/" style={{ color: "#666", textDecoration: "none" }}>Головна</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#000" }}>{searchQuery ? "Пошук" : "Каталог"}</span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px", color: "#222" }}>
            {searchQuery ? `Результати пошуку "${searchQuery}"` : "Каталог товарів"}
          </h1>

          {/* ПОШУК */}
          <form onSubmit={handleLocalSearch} style={{ display: "flex", gap: "8px", marginBottom: "24px", maxWidth: "500px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Пошук товарів..."
                style={{ width: "100%", padding: "12px 40px 12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }}
              />
              {localSearch && (
                <button type="button" onClick={clearSearch} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888" }}>✕</button>
              )}
            </div>
            <button type="submit" style={{ padding: "12px 20px", backgroundColor: "#8b181b", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
              Знайти
            </button>
          </form>

          {/* КАТЕГОРІЇ */}
          <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px" }}>Продукти</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
            {mockCategories.map((cat) => (
              <button key={cat.name} onClick={() => handleCategoryClick(cat.name)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "24px", border: "1px solid #8b181b", backgroundColor: selectedCategory === cat.name ? "#eedbb5" : "transparent", color: "#8b181b", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                <img src={cat.icon} alt={cat.name} style={{ width: "16px", height: "16px" }} onError={(e) => e.target.style.display = "none"} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* ФІЛЬТРИ + СОРТУВАННЯ */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div onClick={() => setIsFilterOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8b181b", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Фільтри
            </div>

            <div style={{ position: "relative" }}>
              <div onClick={() => setIsSortOpen((p) => !p)} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8b181b", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: "#fff", padding: "8px 16px", borderRadius: "12px", border: "1px solid #ddd" }}>
                {SORT_OPTIONS.find((o) => o.value === sortValue)?.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isSortOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {isSortOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, minWidth: "200px", overflow: "hidden" }}>
                  {SORT_OPTIONS.map((option) => (
                    <div key={option.value} onClick={() => { setSortValue(option.value); setIsSortOpen(false); }} style={{ padding: "12px 16px", cursor: "pointer", fontSize: "14px", fontWeight: sortValue === option.value ? "700" : "400", color: sortValue === option.value ? "#8b181b" : "#333", backgroundColor: sortValue === option.value ? "#fff5f5" : "transparent" }}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ЛІЧИЛЬНИК */}
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
            Знайдено: <strong>{total}</strong> товарів
            {totalPages > 1 && ` • Сторінка ${currentPage} з ${totalPages}`}
          </p>

          {/* ТОВАРИ або СКЕЛЕТОН */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px", marginBottom: "48px" }}>
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h2 style={{ fontSize: "20px", marginBottom: "12px", color: "#333" }}>Товарів не знайдено</h2>
              <p style={{ color: "#666", marginBottom: "24px" }}>Спробуйте змінити пошуковий запит або категорію</p>
              <button onClick={() => { setSelectedCategory("Всі"); clearSearch(); }} style={{ backgroundColor: "#8b181b", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 24px", fontWeight: "600", cursor: "pointer" }}>
                Показати всі товари
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px", marginBottom: "48px" }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* ✅ ПАГІНАЦІЯ — сторінки від бекенду */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff", color: currentPage === 1 ? "#ccc" : "#333", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>❮</button>
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`dots-${idx}`} style={{ padding: "0 4px", color: "#666" }}>...</span>
                    ) : (
                      <button key={page} onClick={() => handlePageChange(page)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: currentPage === page ? "none" : "1px solid #ddd", backgroundColor: currentPage === page ? "#8b181b" : "#fff", color: currentPage === page ? "#fff" : "#333", fontWeight: currentPage === page ? "700" : "400", cursor: "pointer" }}>
                        {page}
                      </button>
                    )
                  )}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff", color: currentPage === totalPages ? "#ccc" : "#333", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>❯</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
