import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hostname = "https://your-domain.com";
const routes = [
  "/",
  "/login",
  "/register",
  "/new",
  "/history",
  "/admin",
  "/admin/tasks",
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${hostname}${route}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>
`,
  )
  .join("")}
</urlset>`;

const distPath = path.join(__dirname, "../dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}
fs.writeFileSync(path.join(distPath, "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml сгенерирован в папке dist");
