const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

let carts = {}; // userId -> cart

// GET CART
router.get("/", auth, (req, res) => {
  const userId = req.user.id;
  res.json(carts[userId] || []);
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

module.exports = router;
