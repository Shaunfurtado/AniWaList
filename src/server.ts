import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { animeRoutes } from "./api/anime";
import { libraryRoutes } from "./api/library";
import { db } from "./database"; // Assuming your database setup is here
import Papa from "papaparse";
import { writeFileSync } from "fs";

const app = new Elysia().use(cors());

animeRoutes(app);
libraryRoutes(app);

// Export CSV automatically on server start
app.onStart(() => {
  try {
    // Export Anime table
    const anime = db.query("SELECT id, title, status FROM anime").all();
    const animeCsv = Papa.unparse(anime);
    writeFileSync("./anime_export.csv", animeCsv);
    console.log("Anime data exported to CSV on server start.");

    // Export Library table
    const library = db.query("SELECT * FROM library").all();
    const libraryCsv = Papa.unparse(library);
    writeFileSync("./library_export.csv", libraryCsv);
    console.log("Library data exported to CSV on server start.");
  } catch (error) {
    console.error("Error exporting CSV data on server start:", error);
  }
});

app.listen(3001);

console.log(`Server is running at http://localhost:${app.server?.port}`);
