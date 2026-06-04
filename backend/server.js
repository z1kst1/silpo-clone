require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// ==========================================
// DATABASE
// ==========================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// РОУТИ
// ==========================================

const cartRoutes = require("./routes/cart");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/cart", cartRoutes);

// ==========================================
// РЕЄСТРАЦІЯ
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email) return res.status(400).json({ error: "Email обов'язковий" });
    if (!password) return res.status(400).json({ error: "Пароль обов'язковий" });
    if (password.length < 6) return res.status(400).json({ error: "Пароль мінімум 6 символів" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Користувач з таким email вже існує" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Реєстрація успішна",
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Помилка сервера при реєстрації" });
  }
});

// ==========================================
// ЛОГІН
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email та пароль обов'язкові" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Невірний пароль" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Успішний вхід",
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// ==========================================
// ПРОФІЛЬ — ОТРИМАТИ
// /api/profile  і  /api/auth/me  — обидва працюють
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || null,
      birthDate: user.birthDate || null,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

app.get("/api/profile", authMiddleware, getProfile);
app.get("/api/auth/me", authMiddleware, getProfile);

// ==========================================
// ПРОФІЛЬ — ОНОВИТИ
// ==========================================

app.put("/api/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, birthDate } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone || null,
      birthDate: updatedUser.birthDate || null,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: "Помилка оновлення профілю" });
  }
});

// ==========================================
// ТОВАРИ — ОТРИМАТИ ВСІ
// ?category=Молочні&search=молоко
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const products = await prisma.product.findMany({ where });
    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ error: "Помилка отримання товарів" });
  }
});

// ==========================================
// ТОВАРИ — ОТРИМАТИ ПО ID
// ==========================================

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) return res.status(404).json({ error: "Товар не знайдено" });

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ error: "Помилка отримання товару" });
  }
});

// ==========================================
// ТОВАРИ — СТВОРИТИ
// ==========================================

app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !price) return res.status(400).json({ error: "Назва та ціна обов'язкові" });

    const newProduct = await prisma.product.create({
      data: { name, description, price, category, image, rating: 0 },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ error: "Помилка створення товару" });
  }
});

// ==========================================
// ТОВАРИ — ОНОВИТИ
// ==========================================

app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ error: "Помилка оновлення товару" });
  }
});

// ==========================================
// ТОВАРИ — ВИДАЛИТИ
// ==========================================

app.delete("/api/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Товар видалено" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ error: "Помилка видалення товару" });
  }
});

// ==========================================
// ЗАМОВЛЕННЯ — тимчасово в пам'яті
// ==========================================

let orders = [];

app.post("/api/orders", authMiddleware, (req, res) => {
  const { items, total, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Кошик порожній" });
  }

  const newOrder = {
    id: Date.now(),
    userId: req.user.userId,
    items,
    total,
    address,
    createdAt: new Date(),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get("/api/orders/my", authMiddleware, (req, res) => {
  res.json(orders.filter((o) => o.userId === req.user.userId));
});

app.get("/api/orders", authMiddleware, (req, res) => {
  res.json(orders);
});

// ==========================================
// СТАРТ СЕРВЕРА
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
