import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

// Захист — тільки для ADMIN
function useAdminCheck() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    // Якщо є user і він не адмін — на головну
    if (user && user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user, navigate]);
}

// Модальне вікно для додавання/редагування товару
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: "", price: "", category: "", description: "", image: "" }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) {
      setError("Заповніть назву та ціну");
      return;
    }
    setSaving(true);
    try {
      if (product) {
        await api.put(`/products/${product.id}`, { ...form, price: Number(form.price) });
      } else {
        await api.post("/products", { ...form, price: Number(form.price) });
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Помилка збереження");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1px solid #e0e0e0", fontSize: "14px", outline: "none",
    boxSizing: "border-box", backgroundColor: "#fafafa",
  };
  const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: "600",
    color: "#555", marginBottom: "6px",
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
            {product ? "Редагувати товар" : "Додати товар"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Назва *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Назва товару" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Ціна (грн) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" step="0.01" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Категорія</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Наприклад: Свіжа риба" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>URL зображення</label>
            <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="https://..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Опис</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Опис товару..." style={{ ...inputStyle, height: "80px", resize: "vertical", fontFamily: "inherit" }} />
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: "13px", margin: 0 }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e0e0e0", backgroundColor: "#f5f5f5", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
              Скасувати
            </button>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", backgroundColor: saving ? "#9ca3af" : "#8b181b", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "14px" }}>
              {saving ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  useAdminCheck();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search.trim()) params.append("search", search.trim());
      const response = await api.get(`/products?${params}`);
      const data = response.data;
      if (data.products) {
        setProducts(data.products);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Помилка завантаження:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  async function handleDelete(productId) {
    setDeleting(true);
    try {
      await api.delete(`/products/${productId}`);
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      console.error("Помилка видалення:", err);
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(product) {
    setEditProduct(product);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditProduct(null);
    setModalOpen(true);
  }

  return (
    <div style={{ backgroundColor: "#f9f6f0", minHeight: "100vh", fontFamily: "system-ui, sans-serif", paddingBottom: "60px" }}>

      {/* МОДАЛЬНЕ ВІКНО */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
          onSave={loadProducts}
        />
      )}

      {/* ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ */}
      {deleteConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "32px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🗑️</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>Видалити товар?</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
              "{deleteConfirm.name || deleteConfirm.title}" буде видалено назавжди
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e0e0e0", backgroundColor: "#f5f5f5", cursor: "pointer", fontWeight: "600" }}>
                Скасувати
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} disabled={deleting} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", backgroundColor: "#dc2626", color: "#fff", cursor: deleting ? "not-allowed" : "pointer", fontWeight: "700" }}>
                {deleting ? "..." : "Видалити"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>

        {/* ЗАГОЛОВОК */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 4px 0", color: "#202124" }}>
              Адмін-панель
            </h1>
            <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
              Управління товарами • Всього: {total}
            </p>
          </div>
          <button onClick={handleAdd} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#8b181b", color: "#fff", border: "none", borderRadius: "14px", padding: "12px 24px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
            <span style={{ fontSize: "18px" }}>+</span>
            Додати товар
          </button>
        </div>

        {/* ПОШУК */}
        <div style={{ position: "relative", maxWidth: "400px", marginBottom: "24px" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Пошук товарів..."
            style={{ width: "100%", padding: "12px 40px 12px 16px", borderRadius: "12px", border: "1px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888" }}>✕</button>
          )}
        </div>

        {/* ТАБЛИЦЯ ТОВАРІВ */}
        <div style={{ backgroundColor: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

          {/* ЗАГОЛОВОК ТАБЛИЦІ */}
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 140px 120px", gap: "16px", padding: "16px 24px", backgroundColor: "#f8f8f8", borderBottom: "1px solid #f0f0f0", fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase" }}>
            <div>Фото</div>
            <div>Назва</div>
            <div>Ціна</div>
            <div>Категорія</div>
            <div style={{ textAlign: "right" }}>Дії</div>
          </div>

          {/* РЯДКИ */}
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
              Завантаження товарів...
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
              <p style={{ color: "#888", fontSize: "15px" }}>Товарів не знайдено</p>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 140px 120px", gap: "16px", padding: "16px 24px", alignItems: "center", borderBottom: index < products.length - 1 ? "1px solid #f0f0f0" : "none", transition: "background 0.1s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {/* ФОТО */}
                <div style={{ width: "52px", height: "52px", borderRadius: "10px", border: "1px solid #f0f0f0", overflow: "hidden", flexShrink: 0, backgroundColor: "#f8f8f8" }}>
                  <img
                    src={product.image}
                    alt={product.name || product.title}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>

                {/* НАЗВА */}
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "#202124", marginBottom: "2px", lineHeight: "1.3" }}>
                    {product.name || product.title}
                  </div>
                  {product.description && (
                    <div style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
                      {product.description}
                    </div>
                  )}
                </div>

                {/* ЦІНА */}
                <div style={{ fontWeight: "700", fontSize: "15px", color: "#202124" }}>
                  {Number(product.price).toFixed(2)} ₴
                </div>

                {/* КАТЕГОРІЯ */}
                <div>
                  {product.category ? (
                    <span style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: "600", color: "#555" }}>
                      {product.category}
                    </span>
                  ) : (
                    <span style={{ color: "#ccc", fontSize: "12px" }}>—</span>
                  )}
                </div>

                {/* ДІЇ */}
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#202124" }}
                  >
                    ✏️ Змінити
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product)}
                    style={{ padding: "8px 14px", borderRadius: "8px", border: "none", backgroundColor: "#fef2f2", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#dc2626" }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ПАГІНАЦІЯ */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: page === 1 ? "#f5f5f5" : "#fff", color: page === 1 ? "#ccc" : "#333", cursor: page === 1 ? "not-allowed" : "pointer" }}>❮</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: page === p ? "none" : "1px solid #ddd", backgroundColor: page === p ? "#8b181b" : "#fff", color: page === p ? "#fff" : "#333", fontWeight: page === p ? "700" : "400", cursor: "pointer" }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: page === totalPages ? "#f5f5f5" : "#fff", color: page === totalPages ? "#ccc" : "#333", cursor: page === totalPages ? "not-allowed" : "pointer" }}>❯</button>
          </div>
        )}
      </div>
    </div>
  );
}
