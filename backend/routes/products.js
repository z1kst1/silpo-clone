const express = require("express");
const { PrismaClient } = require("@prisma/client");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const prisma = new PrismaClient();

const router = express.Router();

//
// GET ALL PRODUCTS
//
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

//
// CREATE PRODUCT (ADMIN)
//
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        error: "Заповніть обов'язкові поля",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock || 0),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Помилка сервера",
    });
  }
});

module.exports = router;
