import api from "./api";

// ✅ Створює Stripe Checkout Session на бекенді і повертає URL для оплати.
// Бекенд (Ярослав) має реалізувати:
//   POST /api/payments/create-checkout-session
//   Body: { items: [{ name, price, quantity }], orderId }
//   Response: { url: "https://checkout.stripe.com/..." }
export async function createCheckoutSession(orderData) {
  const response = await api.post("/payments/create-checkout-session", orderData);
  return response.data;
}

// ✅ Перевірка статусу оплати після повернення з Stripe
// GET /api/payments/verify-session?session_id=...
export async function verifyPaymentSession(sessionId) {
  const response = await api.get(`/payments/verify-session?session_id=${sessionId}`);
  return response.data;
}
