import { WebSocketServer } from "ws";
import { verifyToken } from "./utils/jwt.js";

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connection established, waiting for token");

    let authenticated = false;

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "auth" && data.token) {
          const decoded = verifyToken(data.token);
          if (decoded) {
            ws.userId = decoded.userId;
            authenticated = true;
            console.log(`User ${ws.userId} authenticated`);
            ws.send(JSON.stringify({ type: "auth_success" }));
            // Удаляем этот обработчик и заменяем на обычный
            ws.removeAllListeners("message");
            ws.on("message", (msg) => {
              console.log("Message from user", ws.userId, ":", msg.toString());
            });
            return;
          } else {
            ws.send(
              JSON.stringify({ type: "auth_failed", message: "Invalid token" }),
            );
            ws.close(1008, "Invalid token");
            return;
          }
        }
      } catch (e) {
        console.error("Error parsing message:", e);
      }
      // Если не авторизован, закрываем
      if (!authenticated) {
        ws.send(
          JSON.stringify({
            type: "auth_required",
            message: "Please send token",
          }),
        );
        ws.close(1008, "Authentication required");
      }
    });

    ws.on("close", () => {
      console.log("WebSocket disconnected");
    });

    ws.on("error", (err) => {
      console.error("WebSocket client error:", err);
    });
  });

  wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
  });

  return wss;
};

export const notifyUser = (userId, data) => {
  if (!wss) return;
  let count = 0;
  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === 1) {
      client.send(JSON.stringify(data));
      count++;
    }
  });
  console.log(`Notified ${count} client(s) for user ${userId}`);
};

export const broadcast = (data) => {
  if (!wss) return;
  let count = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
      count++;
    }
  });
  console.log(`Broadcast to ${count} client(s)`);
};
