import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  // Беремо користувача з localStorage
  const savedUser = localStorage.getItem("silpo-user");

  // Якщо користувача нема → перекидаємо на login
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  // Якщо користувач є → показуємо сторінку
  return children;
}
