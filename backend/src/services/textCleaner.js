import redis from "../config/redis.js";
import crypto from "crypto";

// Базовый очиститель (синхронный)
const cleanText = (text) => {
  if (typeof text !== "string") return "";
  let cleaned = text.replace(/<[^>]*>/g, "");
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.trim();
};

// Вспомогательная функция с таймаутом для Redis
const redisTimeout = (promise, ms = 1000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Redis timeout")), ms),
    ),
  ]);
};

export const cleanTextWithCache = async (text) => {
  try {
    const hash = crypto.createHash("sha256").update(text).digest("hex");
    const key = `clean:${hash}`;

    // Пытаемся получить из кэша с таймаутом 1 секунда
    const cached = await redisTimeout(redis.get(key));
    if (cached) return cached;

    // Очищаем текст
    const cleaned = cleanText(text);

    // Сохраняем в кэш с таймаутом
    await redisTimeout(redis.set(key, cleaned, "EX", 300));
    return cleaned;
  } catch (error) {
    // Если Redis недоступен или таймаут, просто очищаем без кэша
    return cleanText(text);
  }
};
