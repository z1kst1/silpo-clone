import { Link, useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: "#F5E6BE",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "24px",
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "32px",
        padding: "60px 48px",
        maxWidth: "520px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
      }}>
        {/* 404 число */}
        <div style={{
          fontSize: "96px",
          fontWeight: "900",
          color: "#8b181b",
          lineHeight: "1",
          marginBottom: "8px",
          letterSpacing: "-4px",
        }}>
          404
        </div>

        <div style={{ fontSize: "40px", marginBottom: "24px" }}>🛒</div>

        <h1 style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "#202124",
          margin: "0 0 12px 0",
        }}>
          Сторінку не знайдено
        </h1>

        <p style={{
          fontSize: "15px",
          color: "#666",
          lineHeight: "1.6",
          margin: "0 0 40px 0",
        }}>
          Схоже, ця сторінка переїхала або її ніколи не існувало.
          Але наш каталог товарів нікуди не дівся!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to="/catalog"
            style={{
              backgroundColor: "#8b181b",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "16px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "15px",
              display: "block",
            }}
          >
            Перейти до каталогу
          </Link>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "#f5f5f5",
              color: "#202124",
              padding: "16px 32px",
              borderRadius: "16px",
              border: "none",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            ← Повернутись назад
          </button>
          <Link
            to="/"
            style={{
              color: "#8b181b",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
