import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { animeRoutes } from "./api/anime";
import { libraryRoutes } from "./api/library";
import { db } from "./database";
import { swagger } from '@elysiajs/swagger'
import Papa from "papaparse";
import { writeFileSync } from "fs";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(html())
  // Keep this, but we won't rely on it for core logic anymore
  .use(staticPlugin({ assets: "src/public", prefix: "/public" }));

// Helper to render HTML
async function renderPage(pageName: string) {
  try {
    const layout = await Bun.file("./src/templates/layout.html").text();
    const content = await Bun.file(`./src/templates/${pageName}.html`).text();
    const fullHtml = layout.replace("<!-- CONTENT_PLACEHOLDER -->", content);
    
    return new Response(fullHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    return new Response("Template not found. Check your file structure.", { status: 500 });
  }
}

// API Routes
animeRoutes(app);
libraryRoutes(app);

// UI Routes
app.get("/", () => renderPage("anime"));
app.get("/library", () => renderPage("library"));

// Export CSV on Start
app.onStart(() => {
  try {
    const anime = db.query("SELECT id, title, status FROM anime").all();
    writeFileSync("./anime_export.csv", Papa.unparse(anime));
    
    const library = db.query("SELECT * FROM library").all();
    writeFileSync("./library_export.csv", Papa.unparse(library));
    console.log("CSV Data exported.");
  } catch (error) {
    console.error("Export error:", error);
  }
});

app.listen(3001);
console.log(`Server is running at http://localhost:${app.server?.port}`);