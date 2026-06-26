import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Сервер запущен на порту ${PORT} в режиме ${process.env.NODE_ENV}`,
  );
});
