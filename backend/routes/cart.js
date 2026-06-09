const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

let carts = {}; // userId -> cart

// GET CART
router.get("/", (req, res) => {
  const userId = req.query.userId;
  res.json({ cart: carts[userId] || [] });
});

// ADD ITEM
router.post("/add", auth, (req, res) => {
  const userId = req.user.id;
  const { product } = req.body;

  if (!carts[userId]) {
    carts[userId] = [];
  }

  carts[userId].push(product);

  res.json(carts[userId]);
});

// DELETE ITEM
router.post("/remove", auth, (req, res) => {
  const userId = req.user.id;
  const { index } = req.body;

  carts[userId].splice(index, 1);

  res.json(carts[userId]);
});

router.post("/checkout", auth, (req, res) => {
  if (!req.user.cart || req.user.cart.length === 0) {
    return res.status(400).json({ message: "Кошик пустий" });
  }

  const order = {
    items: req.user.cart,
    date: new Date(),
  };

  req.user.orders = req.user.orders || [];
  req.user.orders.push(order);

  req.user.cart = [];

  res.json({ message: "Замовлення оформлено" });
});

router.get("/orders", auth, (req, res) => {
  res.json({ orders: req.user.orders || [] });
});
module.exports = router;
