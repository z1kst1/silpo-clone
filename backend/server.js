const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Новий стандарт підключення Prisma через адаптер
const pool = new Pool({ connectionString: "postgresql://silpo_admin:silpo_password@127.0.0.1:5432/silpo_ecommerce" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

// Тимчасово закоментуємо старий роут авторизації, бо нова логіка з базою даних тепер прямо тут
// const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.use(cors());
app.use(express.json());

// Секретний ключ для токенів
const JWT_SECRET = "super_secret_silpo_key";

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
let carts = {}; // Додано, щоб не було помилки при оформленні замовлення

// ==========================================
//  НОВИЙ БЛОК: АВТОРИЗАЦІЯ ЧЕРЕЗ БАЗУ ДАНИХ
// ==========================================

// 1. РЕЄСТРАЦІЯ
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });
    res.status(201).json({ message: "Користувач створений!", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Помилка! Можливо, такий email вже існує." });
  }
});

// 2. ЛОГІН
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Невірний пароль" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Успішний вхід!", token });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// app.use("/api/auth", authRoutes); // Старий роут вимкнено
app.use("/api/cart", cartRoutes);


//  Отримати всі товари (з фільтрами)
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

//  Отримати товар по ID
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Товар не знайдено" });
  }

  res.json(product);
});

//  Додати товар
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

//  Оновити товар
app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id == req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Товар не знайдено" });
  }

  Object.assign(product, req.body);

  res.json(product);
});

//  Видалити товар
app.delete("/api/products/:id", (req, res) => {
  products = products.filter((p) => p.id != req.params.id);

  res.json({ message: "Товар видалено" });
});

//  Створити замовлення
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

//  Отримати мої замовлення
app.get("/api/orders/my", (req, res) => {
  const userId = req.user?.id || 1;

  const userOrders = orders.filter((o) => o.userId === userId);

  res.json(userOrders);
});

//  Отримати всі замовлення (admin)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
