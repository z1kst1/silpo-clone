require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Новий стандарт підключення Prisma через адаптер
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

// const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.use(cors());
app.use(express.json());

// Секретний ключ для JWT
const JWT_SECRET = "super_secret_silpo_key";

// Тимчасові масиви
let orders = [];
let carts = {};

// ==========================================
// АВТОРИЗАЦІЯ
// ==========================================

// Реєстрація
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    res.status(201).json({
      message: "Користувач створений!",
      userId: user.id,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: "Помилка! Можливо, такий email вже існує.",
    });
  }
});

// Логін
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: "Користувача не знайдено",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Невірний пароль",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Успішний вхід!",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

// Старий роут вимкнений
// app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);

// ==========================================
// PRODUCTS
// ==========================================

// Отримати всі товари
app.get("/api/products", async (req, res) => {
  try {
    console.log("TEST ROUTE WORKS");

    const products = await prisma.product.findMany();

    console.log(products);

    res.json(products);
  } catch (error) {
    console.log("PRISMA ERROR:");
    console.log(error);

    res.status(500).json({
      error: "Помилка отримання товарів",
      details: error.message,
    });
  }
});

// Отримати товар по ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Товар не знайдено",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Помилка отримання товару",
    });
  }
});

// Додати товар
app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        image,
        rating: 0,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Помилка створення товару",
    });
  }
});

// Оновити товар
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Помилка оновлення товару",
    });
  }
});

// Видалити товар
app.delete("/api/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Товар видалено",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Помилка видалення товару",
    });
  }
});

// ==========================================
// ORDERS
// ==========================================

// Створити замовлення
app.post("/api/orders", (req, res) => {
  const userId = req.user?.id || 1;

  const cart = carts[userId];

  if (!cart || cart.length === 0) {
    return res.status(400).json({
      message: "Кошик порожній",
    });
  }

  const newOrder = {
    id: Date.now(),
    userId,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price, 0),
    createdAt: new Date(),
  };

  orders.push(newOrder);

  carts[userId] = [];

  res.status(201).json(newOrder);
});

// Отримати мої замовлення
app.get("/api/orders/my", (req, res) => {
  const userId = req.user?.id || 1;

  const userOrders = orders.filter((o) => o.userId === userId);

  res.json(userOrders);
});

// Отримати всі замовлення
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ==========================================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
