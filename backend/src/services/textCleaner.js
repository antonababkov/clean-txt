import redis from "../config/redis.js";
import crypto from "crypto";

// Базовый очиститель
const cleanText = (text) => {
  if (typeof text !== "string") return "";
  // Удаляем HTML-теги
  let cleaned = text.replace(/<[^>]*>/g, "");
  // Заменяем множественные пробелы на один
  cleaned = cleaned.replace(/\s+/g, " ");
  // Удаляем управляющие символы
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.trim();
};

export const cleanTextWithCache = async (text) => {
  try {
    const hash = crypto.createHash("sha256").update(text).digest("hex");
    // const key = `clean:${Buffer.from(text).toString("base64")}`;
    const key = `clean:${hash}`;
    const cached = await redis.get(key);
    if (cached) return cached;
    const cleaned = cleanText(text);
    await redis.set(key, cleaned, "EX", 300); // 5 минут
    return cleaned;
  } catch (error) {
    // Если Redis недоступен
    return cleanText(text);
  }
};
