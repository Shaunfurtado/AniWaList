// api/library.ts
import { db } from "../database";
import { readFileSync, writeFileSync } from "fs";
import Papa from 'papaparse';

export const libraryRoutes = (app: any) => {
  app.post("/api/scan-library", () => {
    try {
      const jsonData = JSON.parse(readFileSync('./data/anime-offline-database.json', 'utf-8'));
      
      db.prepare("BEGIN TRANSACTION").run();
      
      const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO library 
        (title) 
        VALUES (?)
      `);

      let insertedCount = 0;
      for (const anime of jsonData.data) {
        insertStmt.run(anime.title);
        insertedCount++;
      }
      
      db.prepare("COMMIT").run();
      
      return { success: true, message: `${insertedCount} anime titles added/updated in the library` };
    } catch (error) {
      console.error("Error scanning library:", error);
      return { success: false, message: "Error scanning library" };
    }
  });

  app.get("/api/library", (req: { query: { page?: string } }) => {
    const { query } = req;
    const page = parseInt(query.page as string) || 1;
    const ITEMS_PER_PAGE = 10;
    
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const library = db.query(`
      SELECT * FROM library 
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `).all();
    
    const totalCount = (db.query("SELECT COUNT(*) as count FROM library").get() as { count: number }).count;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    return { library, totalPages, currentPage: page };
  });

  // Export Library to CSV
  app.get("/api/library/export-csv", () => {
    const library = db.query("SELECT * FROM library").all();
    
    // Convert the library data to CSV
    const csv = Papa.unparse(library);

    // Save CSV to a file
    writeFileSync("./library_export.csv", csv);

    return { success: true, message: "Library data exported to CSV successfully" };
  });
};
