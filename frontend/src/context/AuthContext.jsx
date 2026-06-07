import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Зчитуємо юзера при старті
  useEffect(() => {
    const savedUser = localStorage.getItem("silpo-user");
    const accessToken = localStorage.getItem("token");
    if (savedUser && accessToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Логін
  const login = useCallback((data) => {
    localStorage.setItem("token", data.accessToken || data.token);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    localStorage.setItem("silpo-user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  // Логаут
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (e) {
      // ігноруємо помилки при логауті
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("silpo-user");
    setUser(null);
    window.location.href = "/";
  }, []);

  // Оновлення даних юзера (після редагування профілю)
  const updateUser = useCallback(
    (newData) => {
      const updated = { ...user, ...newData };
      localStorage.setItem("silpo-user", JSON.stringify(updated));
      setUser(updated);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
