import api from "./api";

// Отримати кошик поточного юзера з бекенду
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

// Додати товар до кошика на бекенді
export const addToCartAPI = async (productId, quantity = 1) => {
  const response = await api.post("/cart", { productId, quantity });
  return response.data;
};

// Оновити кількість товару в кошику
export const updateCartItemAPI = async (productId, quantity) => {
  const response = await api.put(`/cart/${productId}`, { quantity });
  return response.data;
};

// Видалити товар з кошика
export const removeFromCartAPI = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

// Очистити весь кошик
export const clearCartAPI = async () => {
  const response = await api.delete("/cart");
  return response.data;
};
