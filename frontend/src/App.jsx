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

// Захищений маршрут — редіректить на /login якщо немає токена
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="catalog" element={<CatalogPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductPage />} />

        {/* Захищений маршрут — тільки для авторизованих */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="login"
          element={
            <>
              <HomePage />
              <LoginPage />
            </>
          }
        />

        <Route
          path="register"
          element={
            <>
              <HomePage />
              <RegisterPage />
            </>
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
