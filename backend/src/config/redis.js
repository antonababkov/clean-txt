import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  connectTimeout: 500,
});

export default redis;
