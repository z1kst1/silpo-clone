const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.use(cors());
app.use(express.json());

let products = [
  {
    id: 1,
    name: "Молоко",
    description: "Свіже молоко 2.5%",
    price: 45,
    category: "Молочні продукти",
    image: "milk.jpg",
    rating: 4.5,
    createdAt: new Date(),
  },
];

let orders = [];

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// 📦 Отримати всі товари (з фільтрами)
app.get("/api/products", (req, res) => {
  let result = [...products];

  const { search, category, minPrice, maxPrice, sort } = req.query;

  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (minPrice) {
    result = result.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  }

  res.json(result);
});

// 🔎 Отримати товар по ID
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Товар не знайдено" });
  }

  res.json(product);
});

// ➕ Додати товар
app.post("/api/products", (req, res) => {
  const { name, description, price, category, image } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    category,
    image,
    rating: 0,
    createdAt: new Date(),
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// ✏️ Оновити товар
app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Товар не знайдено" });
  }

  Object.assign(product, req.body);

  res.json(product);
});

// ❌ Видалити товар
app.delete("/api/products/:id", (req, res) => {
  products = products.filter((p) => p.id != req.params.id);

  res.json({ message: "Товар видалено" });
});

// 📦 Створити замовлення
app.post("/api/orders", (req, res) => {
  const userId = req.user?.id || 1; // тимчасово

  const cart = carts[userId];

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Кошик порожній" });
  }

  const newOrder = {
    id: Date.now(),
    userId,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price, 0),
    createdAt: new Date(),
  };

  orders.push(newOrder);

  carts[userId] = []; // очищаємо кошик

  res.status(201).json(newOrder);
});

// 📦 Отримати мої замовлення
app.get("/api/orders/my", (req, res) => {
  const userId = req.user?.id || 1;

  const userOrders = orders.filter((o) => o.userId === userId);

  res.json(userOrders);
});

// 📦 Отримати всі замовлення (admin)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
