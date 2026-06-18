import api from "./api";

// ✅ Переписано через наш налаштований axios (api.js) замість сирого fetch.
// Це дає: явний BASE_URL з .env (як вимагав ментор), однакову поведінку
// в Docker і при npm run dev, узгоджену обробку помилок з рештою застосунку.

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function forgotPassword(payload) {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
}
