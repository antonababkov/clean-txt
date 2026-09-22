import redis from "../config/redis.js";
import crypto from "crypto";

// Базовый очиститель (синхронный)
const cleanText = (text) => {
  if (typeof text !== "string") return "";
  let cleaned = text.replace(/<[^>]*>/g, "");
  // Удаляем скрытые метки и управляющие символы: форматирующие (Cf) — zero-width
  // пробелы, joiner'ы, BOM, софт-дефис, bidi-метки и т.п., — и все управляющие (Cc),
  // сохраняя whitespace-символы (\t, \n, \r, \v, \f, NEL).
  cleaned = cleaned.replace(/[\p{Cf}\p{Cc}]/gu, (ch) =>
    /[\t\n\r\x0B\x0C\u0085]/.test(ch) ? ch : "",
  );
  // Нормализуем неразрывные пробелы в обычные
  cleaned = cleaned.replace(/\u00a0/g, " ");
  // Нормализуем переводы строк: \r\n и \r → \n
  cleaned = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return cleaned;
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
