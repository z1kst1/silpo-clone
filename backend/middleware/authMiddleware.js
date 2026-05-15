const jwt = require("jsonwebtoken");

// Middleware для перевірки JWT токена
module.exports = (req, res, next) => {
  try {
    // Отримуємо header:
    // Authorization: Bearer TOKEN
    const authHeader = req.headers.authorization;

    // Якщо токена нема
    if (!authHeader) {
      return res.status(401).json({
        error: "Немає токена",
      });
    }

    // Забираємо сам токен
    const token = authHeader.split(" ")[1];

    // Перевіряємо JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Зберігаємо дані користувача
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Невірний токен",
    });
  }
};
