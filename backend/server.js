import app from "./src/app.js";
import { createServer } from "http";
import { initWebSocket } from "./src/websocket.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const wss = initWebSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Сервер запущен на порту ${PORT} в режиме ${process.env.NODE_ENV}`,
  );
  console.log(`🔌 WebSocket server активен`);
});
