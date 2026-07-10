import { useState, useEffect } from "react";
import api from "../api/api";

// Компонент зірочок для рейтингу
function StarRating({ rating, onRate, readonly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: "24px",
            cursor: readonly ? "default" : "pointer",
            color: star <= (hovered || rating) ? "#f59e0b" : "#e0e0e0",
            transition: "color 0.1s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    rating: 0,
    comment: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  // Завантаження відгуків з бекенду
  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await api.get(`/products/${productId}/reviews`);
        setReviews(response.data || []);
      } catch {
        // Якщо endpoint ще не готовий — показуємо порожній список
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.rating === 0) {
      setError("Будь ласка, поставте оцінку");
      return;
    }
    if (!form.comment.trim()) {
      setError("Напишіть коментар");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating: form.rating,
        comment: form.comment,
      });

      // Додаємо новий відгук до списку
      setReviews((prev) => [response.data, ...prev]);
      setForm({ rating: 0, comment: "" });
      setShowForm(false);
      setSuccess("Відгук додано успішно!");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Увійдіть в акаунт, щоб залишити відгук");
      } else {
        setError(err.response?.data?.error || "Помилка при додаванні відгуку");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Середній рейтинг
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "32px",
        padding: "32px",
        marginTop: "24px",
      }}
    >
      {/* ЗАГОЛОВОК */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px 0" }}
          >
            Відгуки
          </h2>
          {avgRating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <span style={{ color: "#f59e0b", fontSize: "18px" }}>★</span>
              <span style={{ fontWeight: "700", fontSize: "16px" }}>
                {avgRating}
              </span>
              <span>({reviews.length} відгуків)</span>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            style={{
              backgroundColor: showForm ? "#f5f5f5" : "#8b181b",
              color: showForm ? "#202124" : "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {showForm ? "Скасувати" : "Залишити відгук"}
          </button>
        ) : (
          <span style={{ fontSize: "13px", color: "#888" }}>
            Увійдіть, щоб залишити відгук
          </span>
        )}
      </div>

      {/* ФОРМА ВІДГУКУ */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fafafa",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #f0f0f0",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#555",
                marginBottom: "8px",
              }}
            >
              Ваша оцінка *
            </div>
            <StarRating
              rating={form.rating}
              onRate={(star) => setForm((prev) => ({ ...prev, rating: star }))}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#555",
                marginBottom: "8px",
              }}
            >
              Коментар *
            </div>
            <textarea
              value={form.comment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Поділіться враженнями про товар..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                height: "100px",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "13px",
                margin: "0 0 12px 0",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: submitting ? "#9ca3af" : "#8b181b",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Відправляємо..." : "Відправити відгук"}
          </button>
        </form>
      )}

      {success && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "16px",
            color: "#16a34a",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ✓ {success}
        </div>
      )}

      {/* СПИСОК ВІДГУКІВ */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#888" }}>
          Завантаження відгуків...
        </div>
      ) : reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 24px",
            color: "#888",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
          <p
            style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 4px 0" }}
          >
            Поки немає відгуків
          </p>
          <p style={{ fontSize: "13px", margin: 0 }}>
            Будьте першим, хто залишить відгук про цей товар
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reviews.map((review, index) => (
            <div
              key={review.id || index}
              style={{
                padding: "20px",
                backgroundColor: "#fafafa",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "14px",
                      color: "#202124",
                      marginBottom: "4px",
                    }}
                  >
                    {review.user?.firstName ||
                      review.user?.name ||
                      "Анонімний користувач"}
                  </div>
                  <StarRating rating={review.rating} readonly />
                </div>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("uk-UA")
                    : ""}
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#444",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
