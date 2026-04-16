const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

let users = [];

router.post("/register", (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email та пароль є обов’язковими",
      });
    }

    const userExists = users.find((u) => u.email === email);

    if (userExists) {
      return res.status(400).json({
        message: "Користувач вже існує",
      });
    }

    const newUser = {
      id: Date.now(),
      name: name || "",
      email,
      password,
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      "secret123",
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Реєстрація успішна",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Помилка реєстрації",
    });
  }
});

router.post("/login", (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email та пароль є обов’язковими",
      });
    }

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return res.status(400).json({
        message: "Невірні дані",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secret123",
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Вхід успішний",
      token,
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Помилка входу",
    });
  }
});

router.post("/forgot-password", (req, res) => {
  try {
    console.log("FORGOT BODY:", req.body);

    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        message: "Вкажіть email",
      });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({
        message: "Користувача з таким email не знайдено",
      });
    }

    return res.json({
      message: "Інструкцію з відновлення паролю умовно надіслано",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Помилка відновлення паролю",
    });
  }
});

module.exports = router;
