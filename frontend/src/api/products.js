export const getProducts = async () => {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Не вдалося отримати товари");
  }

  return response.json();
};
