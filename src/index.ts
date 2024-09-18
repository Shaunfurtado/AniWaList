// index.ts (Elysia backend)

import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'
import { Database } from "bun:sqlite";
import { readFileSync } from "fs";

const db = new Database("anime.db");
db.run(`
  CREATE TABLE IF NOT EXISTS anime (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    status TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE
  )
`);

const ITEMS_PER_PAGE = 10;

const app = new Elysia()
  .use(cors())
  .get("/api/anime", ({ query }) => {
    const page = parseInt(query.page as string) || 1;
    const filter = query.filter as string || 'all';
    
    let queryStr = "SELECT id, title, status FROM anime";
    if (filter === 'completed' || filter === 'yet to watch') {
      queryStr += ` WHERE status = '${filter}'`;
    }
    queryStr += ` LIMIT ${ITEMS_PER_PAGE} OFFSET ${(page - 1) * ITEMS_PER_PAGE}`;
    
    const anime = db.query(queryStr).all();
    const totalCount = (db.query("SELECT COUNT(*) as count FROM anime").get() as { count: number }).count;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return { anime, totalPages, currentPage: page };
  })
  .post("/api/anime", ({ body }) => {
    const { titles, status } = body as { titles: string, status: string };
    const titleList = titles.split("\n").filter((title: string) => title.trim() !== "");

    for (const title of titleList) {
      const existingAnime = db.query("SELECT * FROM anime WHERE title = ?").get(title.trim());
      if (existingAnime) {
        return { success: false, message: `Anime with title '${title.trim()}' already exists` };
      }
      
      db.run("INSERT INTO anime (title, status) VALUES (?, ?)", [title.trim(), status]);
    }

    return { success: true, message: "Anime added successfully" };
  }, {
    body: t.Object({
      titles: t.String(),
      status: t.String()
    })
  })
  .put("/api/anime/:id", ({ params, body }) => {
    const { id } = params;
    const { title, status } = body as { title: string, status: string };
    
    db.run("UPDATE anime SET title = ?, status = ? WHERE id = ?", [title, status, id]);
    
    return { success: true, message: "Anime updated successfully" };
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      title: t.String(),
      status: t.String()
    })
  })
  .delete("/api/anime/:id", ({ params }) => {
    const { id } = params;
    
    const existingAnime = db.query("SELECT * FROM anime WHERE id = ?").get(id);
    if (!existingAnime) {
      return { success: false, message: `Anime with id '${id}' does not exist` };
    }
    
    db.run("DELETE FROM anime WHERE id = ?", [id]);
    
    return { success: true, message: "Anime deleted successfully" };
    }, {
    params: t.Object({
      id: t.Numeric()
    })
    })
  .post("/api/scan-library", () => {
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
        insertStmt.run(
          anime.title
        );
        insertedCount++;
      }
      
      db.prepare("COMMIT").run();
      
      return { success: true, message: `${insertedCount} anime titles added/updated in the library` };
    } catch (error) {
      console.error("Error scanning library:", error);
      return { success: false, message: "Error scanning library" };
    }
  })

  .get("/api/library", ({ query }) => {
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
  })
  .listen(3001);

console.log(`Server is running at http://localhost:${app.server?.port}`);