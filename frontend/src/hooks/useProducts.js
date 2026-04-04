import { useEffect, useState } from "react";
import defaultProducts from "../data/products";

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  function addProduct(productData) {
    const newProduct = {
      ...productData,
      id: Date.now(),
      price: Number(productData.price),
    };

    setProducts((prev) => [newProduct, ...prev]);
  }

  function updateProduct(updatedProduct) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              price: Number(updatedProduct.price),
            }
          : product
      )
    );
  }

  function deleteProduct(productId) {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }

  function resetProducts() {
    setProducts(defaultProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  };
}
