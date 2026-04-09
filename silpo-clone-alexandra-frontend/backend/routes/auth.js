const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

let users = []; // поки без БД

// REGISTER
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: "Користувач вже існує" });
  }

  const newUser = { id: Date.now(), email, password };

  users.push(newUser);

  res.json({ message: "Реєстрація успішна" });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ message: "Невірні дані" });
  }

  const token = jwt.sign({ id: user.id }, "secret123", { expiresIn: "1h" });

  res.json({ token });
});

module.exports = router;
