import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
<<<<<<< HEAD
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
=======
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
>>>>>>> feature/reviews-orders

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
<<<<<<< HEAD
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="product/:id" element={<ProductPage />} />
=======

        <Route path="catalog" element={<CatalogPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />

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
>>>>>>> feature/reviews-orders
      </Route>
    </Routes>
  );
}
