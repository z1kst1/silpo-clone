import { useState } from "react";
import { Link } from "react-router";

// Повний список категорій
const sidebarCategories = [
  { id: "promo", name: "Добрі промо", icon: "/images/figma/icons/categories/promo.svg" },
  { id: "fruits", name: "Фрукти, овочі", icon: "/images/figma/icons/categories/fruits.svg" },
  { id: "meat", name: "М'ясо", icon: "/images/figma/icons/categories/meat.svg" },
  { id: "fish", name: "Риба", icon: "/images/figma/icons/categories/fish.svg" },
  { id: "sausages", name: "Ковбаси та делікатеси", icon: "/images/figma/icons/categories/sausages.svg" },
  { id: "cheese", name: "Сири", icon: "/images/figma/icons/categories/cheese.svg" },
  { id: "bakery", name: "Хліб та випічка", icon: "/images/figma/icons/categories/bread.svg" },
  { id: "food", name: "Готові страви і кулінарія", icon: "/images/figma/icons/categories/food.svg" },
  { id: "milk", name: "Молочка та яйця", icon: "/images/figma/icons/categories/milk.svg" },
  { id: "brands", name: "Власні марки", icon: "/images/figma/icons/categories/brands.svg" },
  { id: "tradition", name: "Лавка Традицій", icon: "/images/figma/icons/categories/tradition.svg" },
  { id: "healthy", name: "Здорове харчування", icon: "/images/figma/icons/categories/healthy.svg" },
  { id: "cans", name: "Бакалія і консерви", icon: "/images/figma/icons/categories/cans.svg" },
  { id: "sauces", name: "Соуси і спеції", icon: "/images/figma/icons/categories/sauces.svg" },
  { id: "sweets", name: "Солодощі", icon: "/images/figma/icons/categories/sweets.svg" }
];

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState("promo");

  return (
    <div style={{ display: "flex", backgroundColor: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* 1. ЛІВИЙ САЙДБАР */}
      <aside style={{
        width: "280px",
        backgroundColor: "#F5E6BE", // ТЕПЕР КОЛІР ІДЕАЛЬНО ЗБІГАЄТЬСЯ З ХЕДЕРОМ
        borderRight: "1px solid rgba(0,0,0,0.05)",
        height: "calc(100vh - 80px)", // Висота рівно на весь екран мінус хедер
        position: "sticky",
        top: "80px",
        display: "flex",              // Вмикаємо Flexbox для контейнера
        flexDirection: "column"       // Розташовуємо елементи в колонку
      }}>
        {sidebarCategories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flex: 1, // МАГІЯ: Кожна кнопка розтягується, щоб рівномірно заповнити висоту!
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "0 24px", // Відступи тільки по боках, висота автоматична
                cursor: "pointer",
                // Трохи темніший фон для активного пункту, щоб виділявся на фоні меню
                backgroundColor: isActive ? "rgba(139, 24, 27, 0.08)" : "transparent",
                position: "relative",
                color: "#333",
                fontSize: "14px",
                fontWeight: isActive ? "700" : "500",
                transition: "background-color 0.2s"
              }}
            >
              {isActive && (
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", backgroundColor: "#8b181b" }}></div>
              )}

              <img
                src={cat.icon}
                alt={cat.name}
                style={{ width: "20px", height: "20px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ width: "20px", height: "20px", backgroundColor: "#ccc", borderRadius: "50%", display: "none" }}></div>

              {cat.name}
            </div>
          );
        })}
      </aside>

      {/* 2. ПРАВА ЧАСТИНА */}
      <main style={{ flex: 1, padding: "40px", backgroundColor: "#fff" }}>

        {activeCategory === "promo" && (
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "32px", color: "#222" }}>Добрі промо</h1>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

              <Link to="/catalog?category=post" style={{ textDecoration: "none" }}>
                <img
                  src="/images/figma/banners/promo-post.png"
                  alt="Все до посту"
                  style={{ width: "280px", height: "140px", borderRadius: "24px", objectFit: "contain", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                />
              </Link>

              <Link to="/catalog?category=wine" style={{ textDecoration: "none" }}>
                <img
                  src="/images/figma/banners/promo-wine.png"
                  alt="Дрібногурт на вино"
                  style={{ width: "280px", height: "140px", borderRadius: "24px", objectFit: "contain", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                />
              </Link>

              <Link to="/catalog" style={{ textDecoration: "none" }}>
                <img
                  src="/images/figma/banners/promo-all.png"
                  alt="Дивитись всі"
                  style={{ width: "280px", height: "140px", borderRadius: "24px", objectFit: "contain", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                />
              </Link>

            </div>
          </div>
        )}

        {activeCategory !== "promo" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>
            <h2>Тут будуть товари з категорії "{sidebarCategories.find(c => c.id === activeCategory)?.name}"</h2>
          </div>
        )}

      </main>
    </div>
  );
}
