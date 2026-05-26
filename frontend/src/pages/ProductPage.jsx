import { Link, useParams } from "react-router";
import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import useProducts from "../hooks/useProducts";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  // Знаходимо товар
  const product = products.find((item) => Number(item.id) === Number(id));

  // Стан для обраного фото в галереї
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  // Схожі товари (з розширенням до 10 штук для красивого скролу)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const filtered = products.filter((item) => item.category === product.category && Number(item.id) !== Number(product.id));

    let extended = [...filtered];
    if (extended.length > 0) {
      while (extended.length < 10) {
        extended = [...extended, ...filtered];
      }
    }
    return extended.slice(0, 10);
  }, [product, products]);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, 1);
  }

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}><h2>Завантаження товару...</h2></div>;
  }

  if (!product) {
    return (
      <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#F5E6BE", minHeight: "100vh" }}>
        <h2>Товар не знайдено</h2>
        <Link to="/catalog" style={{ color: "#1e40af", textDecoration: "underline" }}>Повернутися до каталогу</Link>
      </div>
    );
  }

  // Масив для мініатюр (поки використовуємо головне фото 3 рази)
  const gallery = [product.image, product.image, product.image];

  // Форматування ціни
  const currentPrice = Number(product.price) || 209.90;
  const priceInt = Math.floor(currentPrice);
  const priceDecimal = (currentPrice % 1).toFixed(2).substring(2);

  return (
    <div style={{ backgroundColor: "#F5E6BE", minHeight: "100vh", paddingBottom: "40px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px" }}>

        {/* Хлібні крихти */}
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/" style={{ color: "#666", textDecoration: "none" }}>Головна</Link><span>›</span>
          <Link to="/catalog" style={{ color: "#666", textDecoration: "none" }}>Каталог</Link><span>›</span>
          <Link to="/catalog" style={{ color: "#666", textDecoration: "none" }}>{product.category || "Категорія"}</Link><span>›</span>
          <span style={{ color: "#000", fontWeight: "500" }}>{product.title || product.name}</span>
        </div>

        {/* ОСНОВНИЙ БЛОК ТОВАРУ */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "40px", alignItems: "flex-start" }}>

          {/* ЛІВА ЧАСТИНА: Галерея з мініатюрами */}
          <div style={{ flex: 1, display: "flex", gap: "16px" }}>

            {/* Колонка мініатюр */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {gallery.map((img, index) => (
                <div
                  key={index} onClick={() => setActiveImage(img)}
                  style={{ width: "72px", height: "72px", borderRadius: "12px", backgroundColor: "#fff", border: activeImage === img ? "2px solid #1e40af" : "2px solid transparent", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}
                >
                  <img src={img} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
                </div>
              ))}
            </div>

            {/* Велике фото */}
            <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", height: "440px", padding: "48px", overflow: "hidden" }}>
              <img src={activeImage} alt={product.title || product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
            </div>
          </div>

          {/* ПРАВА ЧАСТИНА: Інформація */}
          <div style={{ width: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Ціна та кнопка */}
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px" }}>
              <h1 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                {product.title || product.name || "Назва товару"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1e40af", marginBottom: "24px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1e40af"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span style={{ fontWeight: "600" }}>{product.rating || "3.4"}</span> <span style={{ color: "#666" }}>- Увійдіть, щоб оцінити</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "700" }}>{priceInt}</span>
                  <span style={{ fontSize: "16px", fontWeight: "700" }}>.{priceDecimal}</span>
                  <span style={{ fontSize: "14px", fontWeight: "500", marginLeft: "4px" }}>грн</span>
                </div>
                <button onClick={handleAddToCart} style={{ backgroundColor: "#1e40af", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src="/images/figma/icons/cart-btn-white.svg" alt="Кошик" width="18" height="18" onError={(e) => e.target.style.display='none'} />
                  У кошик
                </button>
              </div>
            </div>

            {/* Склад */}
            <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "24px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", marginBottom: "12px" }}>Склад <span style={{ color: "#888", transform: "rotate(180deg)", fontSize: "10px" }}>▼</span></div>
              <p style={{ color: "#444", marginBottom: "16px", lineHeight: "1.4" }}>
                {product.description || "Інформація про склад відсутня. Натуральний продукт високої якості без додавання консервантів."}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#666", marginBottom: "16px", fontSize: "12px" }}>
                <span>Містить алергени</span>
                {/* Оновлено! Тепер воно бере дані з бази або ставить "-" */}
                <span style={{ textAlign: "right", fontWeight: "600", color: "#000" }}>{product.allergens || "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>Загальна інформація <span style={{ color: "#888", fontSize: "10px" }}>▼</span></div>
            </div>

            {/* Харчова цінність */}
            <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "24px" }}>
              <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "16px" }}>Харчова цінність на 100 г</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", rowGap: "16px", columnGap: "8px", fontSize: "12px" }}>
                <div><div style={{ color: "#888", marginBottom: "4px", fontSize: "11px" }}>Енергетична цінність (кКал/кДж)</div><div style={{ fontWeight: "700", fontSize: "14px" }}>{product.nutrition?.energy || "153/641"}</div></div>
                <div><div style={{ color: "#888", marginBottom: "4px", fontSize: "11px" }}>Білки (г)</div><div style={{ fontWeight: "700", fontSize: "14px" }}>{product.nutrition?.proteins || "20"}</div></div>
                <div><div style={{ color: "#888", marginBottom: "4px", fontSize: "11px" }}>Вуглеводи (г)</div><div style={{ fontWeight: "700", fontSize: "14px" }}>{product.nutrition?.carbs || "0"}</div></div>
                <div><div style={{ color: "#888", marginBottom: "4px", fontSize: "11px" }}>Жири (г)</div><div style={{ fontWeight: "700", fontSize: "14px" }}>{product.nutrition?.fats || "8.1"}</div></div>
              </div>
            </div>

          </div>
        </div>

        {/* СХОЖІ ТОВАРИ (Червоний блок) */}
        <div style={{ backgroundColor: "#8b181b", borderRadius: "32px", padding: "32px 0 0 0", overflow: "hidden", position: "relative" }}>

          <div style={{ padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Схожі товари</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px" }}>Дивитись всі</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>❮</button>
                <button style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#fff", color: "#8b181b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>❯</button>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px 32px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "8px" }}>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((item, index) => (
                  <div key={`${item.id}-${index}`} style={{ flex: "0 0 calc((100% - 80px) / 6)", minWidth: "160px" }}>
                    <ProductCard product={item} />
                  </div>
                ))
              ) : (
                <p style={{ color: "#888" }}>Немає схожих товарів</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
