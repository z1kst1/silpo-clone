import { useState } from "react";
import { Link } from "react-router";

export default function AuthModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Забороняємо браузеру самовільно оновлювати сторінку і "обнуляти" дані

    if (!email || !password) {
      setError("Будь ласка, заповніть всі поля");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("Відправляємо запит на сервер...");

      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Статус відповіді:", response.status);
      console.log("Дані від бекенду:", data);

      if (response.ok) {
        const tokenToSave = data.token || data.accessToken;

        if (tokenToSave) {
          localStorage.setItem("silpo-token", tokenToSave);
        }

        if (data.user) {
          localStorage.setItem("silpo-user", JSON.stringify(data.user));
        } else {
          localStorage.setItem("silpo-user", JSON.stringify({ email: email }));
        }

        // Примусово закриваємо вікно і переходимо в профіль
        window.location.href = "/profile";
      } else {
        setError(data.message || "Помилка входу: неправильні дані");
      }
    } catch (err) {
      console.error("Помилка виконання запиту:", err);
      setError("Помилка з'єднання з сервером");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-logo">
          <img src="/images/figma/logo/logo.svg" alt="Kalpo" />
        </div>

        <h2 className="auth-title">ПЕРЕВІРКА ВХОДУ</h2>

        {error && <div style={{ color: "red", fontSize: "14px", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Вкажіть ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Пароль</label>
        <input
          type="password"
          placeholder="Вкажіть ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="auth-button"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Зачекайте..." : "Увійти"}
        </button>

        <p className="auth-link">
          Ще не маєш акаунта? <Link to="/register">Зареєструватися</Link>
        </p>

        <div className="auth-help">Допомога</div>
      </div>
    </div>
  );
}
