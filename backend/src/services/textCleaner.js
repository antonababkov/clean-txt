// Базовый очиститель
export const cleanText = (text) => {
  if (typeof text !== "string") return "";
  // Удаляем HTML-теги
  let cleaned = text.replace(/<[^>]*>/g, "");
  // Заменяем множественные пробелы на один
  cleaned = cleaned.replace(/\s+/g, " ");
  // Удаляем управляющие символы
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.trim();
};
