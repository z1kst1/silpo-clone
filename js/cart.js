const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

let carts = {};

// GET CART
router.get("/", auth, (req, res) => {
  const userId = req.user.userId; // виправлено: userId, не id
  res.json({ cart: carts[userId] || [] });
});

// ADD ITEM
router.post("/add", auth, (req, res) => {
  const userId = req.user.userId; // виправлено
  const { product } = req.body;

  if (!carts[userId]) {
    carts[userId] = [];
  }

  carts[userId].push(product);
  res.json(carts[userId]);
});

// DELETE ITEM
router.post("/remove", auth, (req, res) => {
  const userId = req.user.userId; // виправлено
  const { index } = req.body;

  if (!carts[userId]) return res.json([]);

  carts[userId].splice(index, 1);
  res.json(carts[userId]);
});

module.exports = router;
