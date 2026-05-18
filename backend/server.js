require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

// ==========================================
// DATABASE
// ==========================================

// Новий стандарт підключення Prisma через PostgreSQL adapter

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

// Дозволяє frontend робити запити
app.use(cors());

// Дозволяє читати JSON body
app.use(express.json());

// ==========================================
// JWT SECRET
// ==========================================

// Секретний ключ для JWT токенів
// Повинен бути в .env

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// ROUTES
// ==========================================

// Роути кошика
const cartRoutes = require("./routes/cart");

// Middleware авторизації
const authMiddleware = require("./middleware/authMiddleware");

// Підключення роутів
app.use("/api/cart", cartRoutes);

// ==========================================
// ТИМЧАСОВІ ДАНІ
// ==========================================

// Поки без БД для orders/cart

let orders = [];
let carts = {};

// ==========================================
// AUTH
// ==========================================

/*
==========================================
РЕЄСТРАЦІЯ
==========================================
*/

app.post("/api/auth/register", async (req, res) => {
  try {
    // Отримуємо дані з frontend
    const { email, password, name } = req.body;

    // ==========================================
    // ВАЛІДАЦІЯ
    // ==========================================

    // Перевірка чи введений email
    if (!email) {
      return res.status(400).json({
        error: "Email обов'язковий",
      });
    }

    // Перевірка чи введений пароль
    if (!password) {
      return res.status(400).json({
        error: "Пароль обов'язковий",
      });
    }

    // Мінімальна довжина пароля
    if (password.length < 6) {
      return res.status(400).json({
        error: "Пароль повинен містити мінімум 6 символів",
      });
    }

    // ==========================================
    // ПЕРЕВІРКА ЧИ USER ВЖЕ ІСНУЄ
    // ==========================================

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Якщо email вже зайнятий
    if (existingUser) {
      return res.status(400).json({
        error: "Користувач з таким email вже існує",
      });
    }

    // ==========================================
    // ХЕШУВАННЯ ПАРОЛЯ
    // ==========================================

    // НІКОЛИ не зберігаємо пароль як plain text
    // bcrypt автоматично створює hash

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // СТВОРЕННЯ КОРИСТУВАЧА
    // ==========================================

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: name,
      },
    });

    // ==========================================
    // СТВОРЕННЯ JWT ТОКЕНА
    // ==========================================

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // ==========================================
    // ВІДПОВІДЬ FRONTEND
    // ==========================================

    res.status(201).json({
      message: "Реєстрація успішна",

      token,

      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
      error: "Помилка сервера при реєстрації",
    });
  }
});

/*
==========================================
ЛОГІН
==========================================
*/

app.post("/api/auth/login", async (req, res) => {
  try {
    // Дані з frontend
    const { email, password } = req.body;

    // ==========================================
    // ВАЛІДАЦІЯ
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        error: "Email та пароль обов'язкові",
      });
    }

    // ==========================================
    // ПОШУК КОРИСТУВАЧА
    // ==========================================

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Якщо користувача нема
    if (!user) {
      return res.status(404).json({
        error: "Користувача не знайдено",
      });
    }

    // ==========================================
    // ПЕРЕВІРКА ПАРОЛЯ
    // ==========================================

    const validPassword = await bcrypt.compare(password, user.password);

    // Якщо пароль неправильний
    if (!validPassword) {
      return res.status(401).json({
        error: "Невірний пароль",
      });
    }

    // ==========================================
    // JWT TOKEN
    // ==========================================

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({
      message: "Успішний вхід",

      token,

      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:");
    console.error(error);

    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

// ==========================================
// PROFILE
// ==========================================

// Protected route
// Працює тільки якщо є JWT токен

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    // Якщо user не знайдений
    if (!user) {
      return res.status(404).json({
        error: "Користувача не знайдено",
      });
    }

    // Не відправляємо пароль
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

// ==========================================
// PRODUCTS
// ==========================================

/*
==========================================
ОТРИМАТИ ВСІ ТОВАРИ
==========================================
*/

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:");
    console.error(error);

    res.status(500).json({
      error: "Помилка отримання товарів",
    });
  }
});

/*
==========================================
ОТРИМАТИ ТОВАР ПО ID
==========================================
*/

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
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

/*
==========================================
СТВОРИТИ ТОВАР
==========================================
*/

app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // Базова валідація
    if (!name || !price) {
      return res.status(400).json({
        error: "Назва та ціна обов'язкові",
      });
    }

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

/*
==========================================
ОНОВИТИ ТОВАР
==========================================
*/

app.put("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
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

/*
==========================================
ВИДАЛИТИ ТОВАР
==========================================
*/

app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    await prisma.product.delete({
      where: {
        id: productId,
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

/*
==========================================
СТВОРИТИ ЗАМОВЛЕННЯ
==========================================
*/

app.post("/api/orders", (req, res) => {
  // Тимчасово
  const userId = req.user?.id || 1;

  const cart = carts[userId];

  // Якщо кошик порожній
  if (!cart || cart.length === 0) {
    return res.status(400).json({
      message: "Кошик порожній",
    });
  }

  // Створення нового замовлення
  const newOrder = {
    id: Date.now(),

    userId,

    items: cart,

    total: cart.reduce((sum, item) => sum + item.price, 0),

    createdAt: new Date(),
  };

  orders.push(newOrder);

  // Очищення кошика
  carts[userId] = [];

  res.status(201).json(newOrder);
});

/*
==========================================
МОЇ ЗАМОВЛЕННЯ
==========================================
*/

app.get("/api/orders/my", (req, res) => {
  const userId = req.user?.id || 1;

  const userOrders = orders.filter((order) => order.userId === userId);

  res.json(userOrders);
});

/*
==========================================
ВСІ ЗАМОВЛЕННЯ
==========================================
*/

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
