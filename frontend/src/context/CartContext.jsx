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

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const cartTotal = subtotal;

  async function addToCart(product, quantity = 1) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product, quantity }];
    });
    if (localStorage.getItem("token")) {
      try { await addToCartAPI(product.id, quantity); } catch {}
    }
  }

  async function increaseQuantity(productId) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    if (localStorage.getItem("token")) {
      try {
        const item = cartItems.find((i) => i.id === productId);
        if (item) await updateCartItemAPI(productId, item.quantity + 1);
      } catch {}
    }
  }

  async function decreaseQuantity(productId) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    if (localStorage.getItem("token")) {
      try {
        const item = cartItems.find((i) => i.id === productId);
        if (item && item.quantity > 1)
          await updateCartItemAPI(productId, item.quantity - 1);
      } catch {}
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCartItems((prev) =>
      prev.map((item) => item.id === productId ? { ...item, quantity } : item)
    );
    if (localStorage.getItem("token")) {
      try { await updateCartItemAPI(productId, quantity); } catch {}
    }
  }

  async function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    if (localStorage.getItem("token")) {
      try { await removeFromCartAPI(productId); } catch {}
    }
  }

  async function clearCart() {
    setCartItems([]);
    if (localStorage.getItem("token")) {
      try { await clearCartAPI(); } catch {}
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems, cartCount, subtotal, cartTotal,
        addToCart, increaseQuantity, decreaseQuantity,
        updateQuantity, removeFromCart, clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
