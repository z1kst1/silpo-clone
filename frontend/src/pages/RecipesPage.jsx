import { useEffect, useState } from "react";
import api from "../api/api";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/recipes")
      .then((res) => setRecipes(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Завантаження...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Рецепти</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{ borderRadius: "16px", overflow: "hidden" }}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <p style={{ fontWeight: "bold" }}>{recipe.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
