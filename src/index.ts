// index.ts (Elysia backend)

import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'
import { Database } from "bun:sqlite";

const db = new Database("anime.db");
db.run(`
  CREATE TABLE IF NOT EXISTS anime (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    status TEXT
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
  .listen(3001);

console.log(`Server is running at http://localhost:${app.server?.port}`);