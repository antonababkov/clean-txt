import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

let redis;

if (process.env.NODE_ENV === "test") {
  // Мок для тестов – возвращаем объект с методами-заглушками
  redis = {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve("OK"),
    // при необходимости добавьте другие методы (del, expire и т.д.)
  };
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 500,
  });
}

export default redis;
