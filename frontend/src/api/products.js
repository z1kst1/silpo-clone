import api from "./api";

// ✅ Використовуємо наш налаштований axios (з токеном і baseURL)
// замість raw fetch. Це автоматично додає Authorization header
// і правильно обробляє помилки.
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};
