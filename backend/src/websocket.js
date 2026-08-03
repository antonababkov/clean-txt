import { WebSocketServer } from "ws";
import { verifyToken } from "./utils/jwt.js";

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    // Получаем токен из query-параметра (или из заголовка)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    if (!token) {
      ws.close(1008, "Token required");
      return;
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      ws.close(1008, "Invalid token");
      return;
    }
    ws.userId = decoded.userId;

    ws.on("message", (message) => {
      // Обработка сообщений от клиента (опционально)
      console.log("Received:", message.toString());
    });

    ws.on("close", () => {
      console.log(`Client ${ws.userId} disconnected`);
    });
  });

  return wss;
};

// Функция для отправки уведомления конкретному пользователю
export const notifyUser = (userId, data) => {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

// Функция для широковещательной рассылки (например, админам)
export const broadcast = (data) => {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};
