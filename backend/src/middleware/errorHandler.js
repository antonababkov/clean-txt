export const errorHandler = (err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  console.error("📚 Стек:", err.stack);

  const status = err.statusCode || 500;
  const message = err.message || "Внутренняя ошибка сервера";

  // Если это не операционная ошибка, но мы всё равно вернём 500 для безопасности
  res.status(status).json({ message });
};
