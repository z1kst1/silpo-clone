import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";

// Захищений маршрут для адміна
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("silpo-user") || "{}"); } catch { return {}; }
  })();
  if (!token) return <Navigate to="/login" replace />;
  if (user.role && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

// Захищений маршрут — тільки для авторизованих
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// Публічний маршрут — якщо залогінений, редіректить на профіль
function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/profile" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Сторінка успішного замовлення — без Layout (хедер/футер не потрібні) */}
      <Route path="order-success" element={<OrderSuccessPage />} />

      {/* Сторінка 404 — без Layout */}
      <Route path="*" element={<NotFoundPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductPage />} />

        {/* Тільки для авторизованих */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        {/* Тільки для незалогінених */}
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <>
                <HomePage />
                <LoginPage />
              </>
            </PublicOnlyRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicOnlyRoute>
              <>
                <HomePage />
                <RegisterPage />
              </>
            </PublicOnlyRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <>
              <HomePage />
              <ForgotPasswordPage />
            </>
          }
        />
      </Route>
    </Routes>
  );
}
