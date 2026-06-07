const jwt = require("jsonwebtoken");

// ==========================================
// MIDDLEWARE АВТОРИЗАЦІЇ
// ==========================================
// Перевіряє JWT токен у кожному захищеному запиті.
// Якщо токен є і він правильний — пропускає далі.
// Якщо немає або невірний — повертає 401.

const authMiddleware = (req, res, next) => {
  // Токен приходить у заголовку: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // Якщо заголовка взагалі немає
  if (!authHeader) {
    return res.status(401).json({ error: "Токен відсутній" });
  }

  // Витягуємо сам токен (після слова "Bearer ")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Токен відсутній" });
  }

  try {
    // Перевіряємо чи токен справжній
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Зберігаємо дані юзера в запит — щоб роути могли їх використати
    req.user = decoded; // містить { userId, email, isAdmin }

    next(); // пропускаємо далі
  } catch (error) {
    return res.status(401).json({ error: "Невірний або прострочений токен" });
  }
};

module.exports = authMiddleware;
