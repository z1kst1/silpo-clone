import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="catalog" element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="profile" element={<ProfilePage />} />

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
