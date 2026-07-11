import api from "./api";

// Отримати товари з пагінацією та фільтрацією
export const getProducts = async ({
  page = 1,
  limit = 20,
  category,
  subcategory,
  search,
  sortBy,
  order,
  isPromo,
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (category) params.append("category", category);
  if (subcategory) params.append("subcategory", subcategory);
  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);
  if (isPromo) params.append("isPromo", "true");

  const response = await api.get(`/products?${params.toString()}`);
  return response.data; // { products, total, page, limit, totalPages }
};

// Отримати один товар по ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
