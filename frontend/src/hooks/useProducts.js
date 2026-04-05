import { useEffect, useState } from "react";
import defaultProducts from "../data/products";
import { getProducts } from "../api/products";

const STORAGE_KEY = "silpo-products";

function getInitialProducts() {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  const savedProducts = localStorage.getItem(STORAGE_KEY);

  if (!savedProducts) {
    return defaultProducts;
  }

  try {
    const parsedProducts = JSON.parse(savedProducts);

    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
      return parsedProducts;
    }

    return defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export default function useProducts() {
  const [products, setProducts] = useState(getInitialProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const apiProducts = await getProducts();

        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          setProducts(apiProducts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiProducts));
        } else {
          const localProducts = getInitialProducts();
          setProducts(localProducts);
        }
      } catch {
        const localProducts = getInitialProducts();
        setProducts(localProducts);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function addProduct(productData) {
    const newProduct = {
      ...productData,
      id: Date.now(),
      price: Number(productData.price),
    };

    setProducts((prev) => {
      const updatedProducts = [newProduct, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }

  function updateProduct(updatedProduct) {
    setProducts((prev) => {
      const updatedProducts = prev.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              price: Number(updatedProduct.price),
            }
          : product
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }

  function deleteProduct(productId) {
    setProducts((prev) => {
      const updatedProducts = prev.filter((product) => product.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  }

  function resetProducts() {
    setProducts(defaultProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  };
}
