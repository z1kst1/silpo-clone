module.exports = (req, res, next) => {
  try {
    // якщо не ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Доступ заборонено",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Помилка сервера",
    });
  }
};
