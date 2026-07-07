const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Допоміжна функція: підвантажити кошик юзера разом з даними товару
async function loadCart(userId) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
  }));
}

// GET /api/cart — отримати кошик поточного юзера
router.get("/", auth, async (req, res) => {
  try {
    const cart = await loadCart(req.user.userId);
    res.json({ cart });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ error: "Не вдалося завантажити кошик" });
  }
});

// POST /api/cart — додати товар (або збільшити кількість, якщо вже є)
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!productId) {
      return res.status(400).json({ error: "productId обов'язковий" });
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: "Товар не знайдено" });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId: Number(productId),
        },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: req.user.userId,
          productId: Number(productId),
          quantity: qty,
        },
      });
    }

    const cart = await loadCart(req.user.userId);
    res.status(201).json({ cart });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ error: "Не вдалося додати товар до кошика" });
  }
});

// PUT /api/cart/:productId — оновити кількість
router.put("/:productId", auth, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "quantity має бути більше 0" });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.userId, productId } },
    });
    if (!existing) {
      return res.status(404).json({ error: "Товар не знайдено в кошику" });
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
    });

    const cart = await loadCart(req.user.userId);
    res.json({ cart });
  } catch (error) {
    console.error("UPDATE CART ITEM ERROR:", error);
    res.status(500).json({ error: "Не вдалося оновити кошик" });
  }
});

// DELETE /api/cart/:productId — видалити один товар
router.delete("/:productId", auth, async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    await prisma.cartItem.deleteMany({
      where: { userId: req.user.userId, productId },
    });

    const cart = await loadCart(req.user.userId);
    res.json({ cart });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    res.status(500).json({ error: "Не вдалося видалити товар з кошика" });
  }
});

// DELETE /api/cart — очистити весь кошик
router.delete("/", auth, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.userId } });
    res.json({ cart: [] });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);
    res.status(500).json({ error: "Не вдалося очистити кошик" });
  }
});

module.exports = router;
