import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { auth, isAdmin } from "./middleware/auth.js";
import { verifyToken } from "./utils/jwt.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clean Text Service API",
      version: "1.0.0",
      description: "API для очистки текста и управления задачами",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "integer" },
            user_id: { type: "integer" },
            original_text: { type: "string" },
            cleaned_text: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // сканируем все файлы роутов для JSDoc
};

const specs = swaggerJsdoc(options);

// Middleware для проверки доступа (refresh token из cookie)
const swaggerAuth = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.redirect("/404"); // нет токена → на 404
  }
  const decoded = verifyToken(refreshToken);
  if (!decoded || decoded.role !== "admin") {
    return res.redirect("/404"); // невалидный или не админ → на 404
  }
  next(); // пропускаем к Swagger
};

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(specs));
};
