import { createContext, useContext, useEffect, useState } from "react";
import {
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../api/cart";

const CartContext = createContext(null);

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("silpo-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items) {
  localStorage.setItem("silpo-cart", JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  // Зберігаємо в localStorage при кожній зміні кошика
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Додати товар у кошик
  // Якщо бекенд недоступний — зберігаємо локально (fallback)
  async function addToCart(product, quantity = 1) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product, quantity }];
      return updated;
    });

    // Синхронізація з бекендом (якщо є токен)
    if (localStorage.getItem("token")) {
      try {
        await addToCartAPI(product.id, quantity);
      } catch {
        // Якщо бекенд недоступний — кошик вже збережено локально, все ок
        console.log("Кошик збережено локально (бекенд недоступний)");
      }
    }
  }

  // Оновити кількість товару
  async function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    if (localStorage.getItem("token")) {
      try {
        await updateCartItemAPI(productId, quantity);
      } catch {
        console.log("Оновлення кількості збережено локально");
      }
    }
  }

  // Видалити товар з кошика
  async function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

    if (localStorage.getItem("token")) {
      try {
        await removeFromCartAPI(productId);
      } catch {
        console.log("Видалення збережено локально");
      }
    }
  }

  // Очистити кошик
  async function clearCart() {
    setCartItems([]);

    if (localStorage.getItem("token")) {
      try {
        await clearCartAPI();
      } catch {
        console.log("Очищення кошика збережено локально");
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
