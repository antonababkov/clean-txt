import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true })],
  build: {
    minify: "terser", // используем terser для минификации
    terserOptions: {
      compress: {
        drop_console: true, // удаляет все console.log
        drop_debugger: true, // удаляет debugger
      },
    },
    // Уменьшение размера CSS
    cssCodeSplit: true,
    // Генерация source map
    sourcemap: false,
    // Целевая версия браузеров
    target: "es2020",
    // Увеличить предупреждение о размере чанка (по умолчанию 500kb)
    chunkSizeWarningLimit: 1000,
    // Разделение кода на чанки для кэширования
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("redux")) return "vendor-redux";
            if (id.includes("chart.js")) return "vendor-chart";
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "chart.js",
      "react-chartjs-2",
    ],
  },
});
