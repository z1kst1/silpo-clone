import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../api/products";
import defaultProducts from "../data/products";
export default function useProducts({
  page = 1,
  limit = 20,
  category,
  subcategory,
  search,
  sortBy,
  order,
  isPromo,
} = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({
        page,
        limit,
        category,
        subcategory,
        search,
        sortBy,
        order,
        isPromo,
      });
      // Бекенд повертає { products, total, totalPages }
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        // Старий формат — просто масив (fallback)
        setProducts(data);
        setTotal(data.length);
        setTotalPages(1);
      } else {
        throw new Error("Невідомий формат відповіді");
      }
    } catch (err) {
      console.error("Помилка завантаження товарів:", err);
      setError("Не вдалося завантажити товари");
      // ✅ Fallback на локальні дані якщо бекенд недоступний
      setProducts(defaultProducts);
      setTotal(defaultProducts.length);
      setTotalPages(Math.ceil(defaultProducts.length / limit));
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, subcategory, search, sortBy, order, isPromo]);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ✅ Адмін-функції збережені для адмін-панелі
  function addProduct(productData) {
    const newProduct = {
      ...productData,
      id: Date.now(),
      price: Number(productData.price),
    };
    setProducts((prev) => [newProduct, ...prev]);
    setTotal((prev) => prev + 1);
  }

  function updateProduct(updatedProduct) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id
          ? { ...updatedProduct, price: Number(updatedProduct.price) }
          : product,
      ),
    );
  }

  function deleteProduct(productId) {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    setTotal((prev) => prev - 1);
  }

  function resetProducts() {
    setProducts(defaultProducts);
    setTotal(defaultProducts.length);
  }

  return {
    products,
    loading,
    error,
    total,
    totalPages,
    refetch: loadProducts,
    // Адмін-функції
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  };
}
