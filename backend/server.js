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
const multer = require("multer");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors({ origin: true, credentials: true }));

// Stripe webhook ПОВИНЕН йти ДО express.json(),
// бо Stripe вимагає сирий (raw) body для перевірки підпису
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await prisma.order
          .update({
            where: { id: Number(orderId) },
            data: { status: "paid" },
          })
          .catch((err) =>
            console.error("WEBHOOK: не вдалося оновити замовлення", err),
          );
      }
    }

    res.json({ received: true });
  },
);

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";
const JWT_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

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
// HELPERS — генерація токенів
// ==========================================

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

// ==========================================
// DTO — форматування відповідей API
// Повертаємо тільки потрібні фронтенду поля,
// ніколи не віддаємо пароль чи внутрішні службові поля.
// ==========================================

// Форматує Date у рядок дд.мм.рррр для фронтенду
function formatDateForFrontend(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName || null,
    phone: user.phone || null,
    birthDate: formatDateForFrontend(user.birthDate),
    gender: user.gender || null,
    address: user.address || null,
    isAdmin: user.isAdmin,
  };
}

function formatUserBrief(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}

function formatProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || null,
    price: product.price,
    oldPrice: product.oldPrice || null,
    category: product.category,
    subcategory: product.subcategory || null,
    image: product.image || null,
    images: (product.images || [])
      .sort((a, b) => a.order - b.order)
      .map((img) => img.url),
    rating: product.rating,
    isPromo: product.isPromo,
  };
}

function formatReview(review) {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment || null,
    createdAt: review.createdAt,
    user: review.user
      ? { firstName: review.user.firstName, lastName: review.user.lastName }
      : null,
  };
}

function formatProductWithReviews(product) {
  return {
    ...formatProduct(product),
    reviews: (product.reviews || []).map(formatReview),
  };
}

function formatRecipe(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image || null,
    description: recipe.description || null,
  };
}

function formatOrderItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  };
}

function formatOrder(order) {
  const dto = {
    id: order.id,
    total: order.total,
    address: order.address,
    status: order.status,
    paymentMethod: order.paymentMethod,
    comment: order.comment || null,
    createdAt: order.createdAt,
    items: (order.items || []).map(formatOrderItem),
  };
  if (order.user) {
    dto.user = {
      email: order.user.email,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
    };
  }
  return dto;
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
        .status(409)
        .json({ error: "Користувач з таким email вже існує" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
      return res.status(401).json({ error: "Невірний email або пароль" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Невірний email або пароль" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
// REFRESH TOKEN (JWT, без зберігання в БД)
// ==========================================

app.post("/api/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token відсутній" });

    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch {
      return res
        .status(401)
        .json({ error: "Невалідний або протермінований refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user)
      return res.status(401).json({ error: "Користувача не знайдено" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

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
  // JWT refresh токени не зберігаються в БД,
  // тому logout просто повідомляє клієнту видалити токени
  res.json({ message: "Вихід виконано" });
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

// ==========================================
// SMS-ВІДПРАВКА (підтвердження телефону)
// ==========================================
// Реального SMS-провайдера (Twilio тощо) не підключено — потрібні власні
// облікові дані. Поки що код лише логується в консоль бекенду (dev-режим),
// щоб фронтенд і QA могли протестувати весь флоу без реального SMS.
// Щоб підключити Twilio: npm install twilio, додати в .env
// TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER,
// і розкоментувати блок нижче.
async function sendSms(phone, code) {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    const twilio = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    await twilio.messages.create({
      body: `Код підтвердження Kalpo: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return;
  }
  console.log(`[DEV SMS] Код підтвердження для ${phone}: ${code}`);
}

const SMS_CODE_TTL_MS = 5 * 60 * 1000; // 5 хвилин

app.post("/api/auth/send-sms", authMiddleware, async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\+?\d{9,15}$/.test(phone.replace(/[\s()-]/g, ""))) {
    return res.status(400).json({ error: "Вкажіть коректний номер телефону" });
  }

  try {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + SMS_CODE_TTL_MS);

    await prisma.smsVerificationCode.create({
      data: { phone, code, expiresAt },
    });

    await sendSms(phone, code);

    res.json({
      message: "Код надіслано",
      // Код повертається в відповіді лише поза продакшн-середовищем,
      // щоб можна було тестувати без реального SMS-провайдера.
      ...(process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("SEND SMS ERROR:", error);
    res.status(500).json({ error: "Не вдалося надіслати SMS" });
  }
});

app.post("/api/auth/verify-sms", authMiddleware, async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "Телефон і код обов'язкові" });
  }

  try {
    const record = await prisma.smsVerificationCode.findFirst({
      where: { phone, code, used: false },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return res.status(400).json({ error: "Невірний код" });
    }

    if (record.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ error: "Код протермінований, запросіть новий" });
    }

    await prisma.smsVerificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { phone },
    });

    res.json({
      message: "Телефон підтверджено",
      user: formatUser(updatedUser),
    });
  } catch (error) {
    console.error("VERIFY SMS ERROR:", error);
    res.status(500).json({ error: "Не вдалося перевірити код" });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email обов'язковий" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({
        message: "Якщо такий email існує, ми надішлемо інструкції",
      });
    }

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 година

    await prisma.passwordResetToken.create({
      data: { token: resetToken, userId: user.id, expiresAt },
    });

    await transporter.sendMail({
      from: `"Kalpo Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Відновлення паролю — Kalpo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #8E1616;">Відновлення паролю</h2>
          <p>Ви отримали цей лист тому що хтось запросив скидання паролю для вашого акаунту.</p>
          <p>Натисніть кнопку нижче щоб встановити новий пароль:</p>
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}"
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

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

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

// Парсить дату у форматі дд.мм.рррр (як вводить користувач на фронтенді)
// у коректний JS Date. Використання new Date(рядок) тут неприпустиме —
// Node.js читає крапки як американський формат MM.DD.YYYY.
function parseUkrainianDate(value) {
  if (!value) return null;
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return Number.isNaN(date.getTime()) ? null : date;
}

app.put("/api/profile", authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      phone,
      birthDate,
      gender,
      address,
    } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
        middleName,
        phone,
        gender,
        address,
        birthDate: birthDate ? parseUkrainianDate(birthDate) : null,
      },
    });
    res.json(formatUser(updatedUser));
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: "Помилка оновлення профілю" });
  }
});

// ==========================================
// КАТЕГОРІЇ — окремий роут (список + підкатегорії)
// ==========================================

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    res.json(categories.map((c) => c.category));
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    res.status(500).json({ error: "Помилка отримання категорій" });
  }
});

app.get("/api/categories/:category/subcategories", async (req, res) => {
  try {
    const { category } = req.params;
    const subcategories = await prisma.product.findMany({
      where: { category, subcategory: { not: null } },
      select: { subcategory: true },
      distinct: ["subcategory"],
      orderBy: { subcategory: "asc" },
    });
    res.json(subcategories.map((s) => s.subcategory));
  } catch (error) {
    console.error("GET SUBCATEGORIES ERROR:", error);
    res.status(500).json({ error: "Помилка отримання підкатегорій" });
  }
});

// ==========================================
// ТОВАРИ — публічні (GET) з пагінацією та сортуванням
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      isPromo,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const where = {};
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (subcategory) where.subcategory = subcategory;
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (isPromo === "true") where.isPromo = true;

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
        include: { images: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products: products.map(formatProduct),
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
        images: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!product) return res.status(404).json({ error: "Товар не знайдено" });
    res.json(formatProductWithReviews(product));
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання товару" });
  }
});

// ==========================================
// ТОВАРИ — тільки адмін (POST/PUT/DELETE)
// ==========================================

app.post("/api/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      image,
      images,
      oldPrice,
      isPromo,
    } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: "Назва та ціна обов'язкові" });

    // image — перше фото з масиву, для сумісності зі старою схемою
    const firstImage = image || images?.[0] || null;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        subcategory,
        image: firstImage,
        oldPrice: oldPrice ? Number(oldPrice) : undefined,
        isPromo: isPromo === true || isPromo === "true",
        rating: 0,
        images: {
          create: (images || []).map((url, index) => ({ url, order: index })),
        },
      },
      include: { images: true },
    });
    res.status(201).json(formatProduct(newProduct));
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
      const {
        name,
        description,
        price,
        category,
        subcategory,
        image,
        images,
        oldPrice,
        isPromo,
      } = req.body;

      const firstImage = image || images?.[0] || null;

      const updateData = {
        name,
        description,
        price: price ? Number(price) : undefined,
        category,
        subcategory,
        image: firstImage,
        oldPrice: oldPrice !== undefined ? Number(oldPrice) : undefined,
        isPromo:
          isPromo !== undefined
            ? isPromo === true || isPromo === "true"
            : undefined,
      };

      // Оновлюємо фото тільки якщо images переданий у запиті —
      // інакше старі фото лишаються без змін (часткове оновлення товару)
      if (images !== undefined) {
        updateData.images = {
          deleteMany: {},
          create: images.map((url, index) => ({ url, order: index })),
        };
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data: updateData,
        include: { images: true },
      });
      res.json(formatProduct(updatedProduct));
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
      res.status(204).send();
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      res.status(500).json({ error: "Помилка видалення товару" });
    }
  },
);

// ==========================================
// РЕЦЕПТИ
// ==========================================

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(recipes.map(formatRecipe));
  } catch (error) {
    console.error("GET RECIPES ERROR:", error);
    res.status(500).json({ error: "Помилка отримання рецептів" });
  }
});

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
    res.json(reviews.map(formatReview));
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
        .status(409)
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

    res.status(201).json(formatReview(review));
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
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Помилка видалення відгуку" });
  }
});

// ==========================================
// ЗАМОВЛЕННЯ
// ==========================================

app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { items, address, paymentMethod, comment } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Кошик порожній" });
    }

    // Безпека: ціну й назву товару беремо ТІЛЬКИ з бази даних,
    // а не з тіла запиту — інакше клієнт міг би підмінити ціну перед відправкою.
    const productIds = items.map((item) => Number(item.productId || item.id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productsById = new Map(products.map((p) => [p.id, p]));

    const orderItemsData = [];
    for (const item of items) {
      const productId = Number(item.productId || item.id);
      const product = productsById.get(productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Товар з id ${productId} не знайдено` });
      }
      const quantity = Number(item.quantity) || 1;
      orderItemsData.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    const total = orderItemsData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total,
        address,
        paymentMethod: paymentMethod || "cash",
        comment,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    res.status(201).json(formatOrder(order));
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
    res.json(orders.map(formatOrder));
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

    res.json(formatOrder(order));
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
    res.json(orders.map(formatOrder));
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

      res.json(formatOrder(order));
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
      res.json(users.map(formatUserBrief));
    } catch (error) {
      res.status(500).json({ error: "Помилка отримання юзерів" });
    }
  },
);

// ==========================================
// ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ (Cloudinary)
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

app.post(
  "/api/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "Файл не завантажено" });

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

      res
        .status(201)
        .json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ error: "Помилка завантаження зображення" });
    }
  },
);

// ==========================================
// STRIPE ПЛАТЕЖІ
// ==========================================

app.post(
  "/api/payments/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { orderId, items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Кошик порожній" });
      }

      // Безпека: ціну й назву товару для Stripe беремо ТІЛЬКИ з бази даних,
      // інакше клієнт міг би підмінити ціну в запиті й оплатити копійки.
      const productIds = items.map((item) => Number(item.productId || item.id));
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
      const productsById = new Map(products.map((p) => [p.id, p]));

      const lineItems = [];
      for (const item of items) {
        const productId = Number(item.productId || item.id);
        const product = productsById.get(productId);
        if (!product) {
          return res
            .status(400)
            .json({ error: `Товар з id ${productId} не знайдено` });
        }
        lineItems.push({
          price_data: {
            currency: "uah",
            product_data: { name: product.name },
            unit_amount: Math.round(product.price * 100), // копійки
          },
          quantity: Number(item.quantity) || 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        metadata: { orderId: orderId ? String(orderId) : "" },
      });

      res.status(201).json({ url: session.url });
    } catch (error) {
      console.error("STRIPE CREATE SESSION ERROR:", error);
      res.status(500).json({ error: "Не вдалося створити сесію оплати" });
    }
  },
);

app.get("/api/payments/verify-session", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ error: "session_id відсутній" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid";

    if (paid && session.metadata?.orderId) {
      await prisma.order.update({
        where: { id: Number(session.metadata.orderId) },
        data: { status: "paid" },
      });
    }

    res.json({ paid, orderId: session.metadata?.orderId || null });
  } catch (error) {
    console.error("STRIPE VERIFY SESSION ERROR:", error);
    res.status(500).json({ error: "Не вдалося перевірити оплату" });
  }
});

// ==========================================
// СТАРТ
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
