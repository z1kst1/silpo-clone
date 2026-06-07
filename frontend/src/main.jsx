import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { CartProvider } from "./context/CartContext";
<<<<<<< HEAD
=======
import { AuthProvider } from "./context/AuthContext";
>>>>>>> feature/reviews-orders
import "./styles/global.css";
import "./styles/account.css";
import "./styles/admin.css";
import "./styles/kalpo-home.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
=======
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
>>>>>>> feature/reviews-orders
);
