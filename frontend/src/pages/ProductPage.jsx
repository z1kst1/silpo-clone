import { Link, useParams } from "react-router";
import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import useProducts from "../hooks/useProducts";
import ReviewsSection from "../components/ReviewsSection";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  const product = products.find((item) => Number(item.id) === Number(id));

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product || !products.length) return [];

    const sameCategory = products.filter(
      (item) => item.category === product.category && Number(item.id) !== Number(product.id)
    );

    let results = [...sameCategory];

    if (results.length < 8) {
      const otherProducts = products.filter(
        (item) => item.category !== product.category && Number(item.id) !== Number(product.id)
      );
      const shuffledOthers = [...otherProducts].sort(() => 0.5 - Math.random());
      results = [...results, ...shuffledOthers.slice(0, 8 - results.length)];
    }

    return results.sort(() => 0.5 - Math.random()).slice(0, 8);
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

  const gallery = [product.image, product.image, product.image];

  const currentPrice = Number(product.price) || 209.90;
  const priceInt = Math.floor(currentPrice);
  const priceDecimal = (currentPrice % 1).toFixed(2).substring(2);

  return (
    <div style={{ backgroundColor: "#F5E6BE", minHeight: "100vh", paddingBottom: "40px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "16px 40px" }}>

        <div style={{ fontSize: "12px", color: "#666", marginBottom: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/" style={{ color: "#666", textDecoration: "none" }}>Головна</Link><span>›</span>
          <Link to="/catalog" style={{ color: "#666", textDecoration: "none" }}>Каталог</Link><span>›</span>
          <Link to="/catalog" style={{ color: "#666", textDecoration: "none" }}>{product.category || "Категорія"}</Link><span>›</span>
          <span style={{ color: "#000", fontWeight: "500" }}>{product.title || product.name}</span>
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "40px", alignItems: "flex-start" }}>

          <div style={{ flex: 1, display: "flex", gap: "16px" }}>
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

            <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", height: "440px", padding: "48px", overflow: "hidden" }}>
              <img src={activeImage} alt={product.title || product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
            </div>
          </div>

          <div style={{ width: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>

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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  У кошик
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "24px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", marginBottom: "12px" }}>Склад <span style={{ color: "#888", transform: "rotate(180deg)", fontSize: "10px" }}>▼</span></div>
              <p style={{ color: "#444", marginBottom: "16px", lineHeight: "1.4" }}>
                {product.description || "Інформація про склад відсутня. Натуральний продукт високої якості без додавання консервантів."}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#666", marginBottom: "16px", fontSize: "12px" }}>
                <span>Містить алергени</span>
                <span style={{ textAlign: "right", fontWeight: "600", color: "#000" }}>
                  {product.allergens && product.allergens !== "-" ? product.allergens : "немає"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>Загальна інформація <span style={{ color: "#888", fontSize: "10px" }}>▼</span></div>
            </div>

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


        {/* ВІДГУКИ */}
        <ReviewsSection productId={id} />

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
