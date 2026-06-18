require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_DAYS = 7;

const cartRoutes = require("./routes/cart");
const authMiddleware = require("./middleware/authMiddleware");
app.use("/api/cart", cartRoutes);

// ==========================================
// MIDDLEWARE: тільки для адміна
// ==========================================

function adminMiddleware(req, res, next) {
  if (!req.user?.isAdmin) {
    return res
      .status(403)
      .json({ error: "Доступ заборонено. Потрібні права адміна." });
  }
  next();
}

// ==========================================
// HELPERS
// ==========================================

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);
  await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || null,
    birthDate: user.birthDate || null,
    gender: user.gender || null,
    isAdmin: user.isAdmin,
  };
}

// ==========================================
// РЕЄСТРАЦІЯ
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email) return res.status(400).json({ error: "Email обов'язковий" });
    if (!password)
      return res.status(400).json({ error: "Пароль обов'язковий" });
    if (password.length < 6)
      return res.status(400).json({ error: "Пароль мінімум 6 символів" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ error: "Користувач з таким email вже існує" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    res.status(201).json({
      message: "Реєстрація успішна",
      accessToken,
      refreshToken,
      user: formatUser(user),
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

    if (!email || !password)
      return res.status(400).json({ error: "Email та пароль обов'язкові" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Невірний пароль" });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    res.json({
      message: "Успішний вхід",
      accessToken,
      refreshToken,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// ==========================================
// REFRESH TOKEN
// ==========================================

app.post("/api/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token відсутній" });

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord)
      return res.status(401).json({ error: "Невалідний refresh token" });

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return res.status(401).json({ error: "Refresh token протермінований" });
    }

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newAccessToken = generateAccessToken(tokenRecord.user);
    const newRefreshToken = await generateRefreshToken(tokenRecord.user.id);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("REFRESH ERROR:", error);
    res.status(500).json({ error: "Помилка оновлення токена" });
  }
});

// ==========================================
// LOGOUT
// ==========================================

app.post("/api/auth/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: "Вихід виконано" });
  } catch (error) {
    res.status(500).json({ error: "Помилка виходу" });
  }
});

// ==========================================
// FORGOT PASSWORD (реальна відправка email)
// ==========================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email обов'язковий" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Не розкриваємо чи існує email — відповідь однакова
    if (!user) {
      return res.json({
        message: "Якщо такий email існує, ми надішлемо інструкції",
      });
    }

    // Видаляємо старі токени цього юзера
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Генеруємо новий токен
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 година

    // Зберігаємо в БД
    await prisma.passwordResetToken.create({
      data: { token: resetToken, userId: user.id, expiresAt },
    });

    // Відправляємо email
    await transporter.sendMail({
      from: `"Kalpo Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Відновлення паролю — Kalpo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #8E1616;">Відновлення паролю</h2>
          <p>Ви отримали цей лист тому що хтось запросив скидання паролю для вашого акаунту.</p>
          <p>Натисніть кнопку нижче щоб встановити новий пароль:</p>
          <a href="http://localhost:5173/reset-password?token=${resetToken}"
             style="display: inline-block; padding: 12px 24px; background: #8E1616; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Скинути пароль
          </a>
          <p style="color: #999; font-size: 13px;">Посилання дійсне 1 годину. Якщо ви не запитували скидання — просто ігноруйте цей лист.</p>
        </div>
      `,
    });

    res.json({ message: "Якщо такий email існує, ми надішлемо інструкції" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ error: "Помилка відправки email" });
  }
});

// ==========================================
// RESET PASSWORD
// ==========================================

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Токен та пароль обов'язкові" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль мінімум 6 символів" });
  }

  try {
    // Шукаємо токен в БД
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record) {
      return res.status(400).json({ error: "Невалідний токен" });
    }

    if (record.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return res.status(400).json({ error: "Токен протермінований" });
    }

    // Оновлюємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

    // Видаляємо використаний токен
    await prisma.passwordResetToken.delete({ where: { token } });

    res.json({ message: "Пароль успішно змінено" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ error: "Помилка зміни паролю" });
  }
});

// ==========================================
// ПРОФІЛЬ
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });
    res.json(formatUser(user));
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

app.get("/api/profile", authMiddleware, getProfile);
app.get("/api/auth/me", authMiddleware, getProfile);

app.put("/api/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, birthDate, gender } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
        phone,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });
    res.json(formatUser(updatedUser));
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: "Помилка оновлення профілю" });
  }
});

// ==========================================
// ТОВАРИ — публічні (GET) з пагінацією та сортуванням
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const skip = (Number(page) - 1) * Number(limit);

    const validSortFields = ["createdAt", "price", "rating", "name"];
    const validOrders = ["asc", "desc"];

    const orderBy = {
      [validSortFields.includes(sortBy) ? sortBy : "createdAt"]:
        validOrders.includes(order) ? order : "desc",
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ error: "Помилка отримання товарів" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!product) return res.status(404).json({ error: "Товар не знайдено" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання товару" });
  }
});

// ==========================================
// ТОВАРИ — тільки адмін (POST/PUT/DELETE)
// ==========================================

app.post("/api/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: "Назва та ціна обов'язкові" });
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        image,
        rating: 0,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ error: "Помилка створення товару" });
  }
});

app.put(
  "/api/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, description, price, category, image } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          description,
          price: price ? Number(price) : undefined,
          category,
          image,
        },
      });
      res.json(updatedProduct);
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      res.status(500).json({ error: "Помилка оновлення товару" });
    }
  },
);

app.delete(
  "/api/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await prisma.product.delete({ where: { id: Number(req.params.id) } });
      res.json({ message: "Товар видалено" });
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      res.status(500).json({ error: "Помилка видалення товару" });
    }
  },
);

// ==========================================
// ВІДГУКИ
// ==========================================

app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: Number(req.params.id) },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання відгуків" });
  }
});

app.post("/api/products/:id/reviews", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = Number(req.params.id);

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Рейтинг має бути від 1 до 5" });
    }

    const existing = await prisma.review.findFirst({
      where: { userId: req.user.userId, productId },
    });
    if (existing)
      return res
        .status(400)
        .json({ error: "Ви вже залишили відгук для цього товару" });

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId: req.user.userId,
        productId,
      },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    res.status(500).json({ error: "Помилка створення відгуку" });
  }
});

app.delete("/api/reviews/:id", authMiddleware, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!review) return res.status(404).json({ error: "Відгук не знайдено" });

    if (review.userId !== req.user.userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Немає прав для видалення цього відгуку" });
    }

    await prisma.review.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Відгук видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка видалення відгуку" });
  }
});

// ==========================================
// ЗАМОВЛЕННЯ
// ==========================================

app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { items, total, address, paymentMethod, comment } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Кошик порожній" });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total: Number(total),
        address,
        paymentMethod: paymentMethod || "cash",
        comment,
        items: {
          create: items.map((item) => ({
            productId: item.productId || item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ error: "Помилка створення замовлення" });
  }
});

app.get("/api/orders/my", authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ error: "Помилка отримання замовлень" });
  }
});

app.get("/api/orders/:id", authMiddleware, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { items: true },
    });

    if (!order)
      return res.status(404).json({ error: "Замовлення не знайдено" });

    if (order.userId !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Немає доступу" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання замовлення" });
  }
});

app.get("/api/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: { select: { email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання замовлень" });
  }
});

app.patch(
  "/api/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = [
        "pending",
        "confirmed",
        "preparing",
        "delivering",
        "delivered",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Невірний статус замовлення" });
      }

      const order = await prisma.order.update({
        where: { id: Number(req.params.id) },
        data: { status },
      });

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Помилка оновлення статусу" });
    }
  },
);

// ==========================================
// АДМІН — список юзерів
// ==========================================

app.get(
  "/api/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isAdmin: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Помилка отримання юзерів" });
    }
  },
);

/// ==========================================
// ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ (Cloudinary)
// ==========================================

const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Зберігаємо файл в пам'яті (не на диск)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Тільки JPG, PNG, WEBP"));
    }
  },
});

// Роут завантаження
app.post(
  "/api/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "Файл не завантажено" });

      // Завантажуємо в Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "kalpo-shop", resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ error: "Помилка завантаження зображення" });
    }
  },
);

// ==========================================
// СТАРТ
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
