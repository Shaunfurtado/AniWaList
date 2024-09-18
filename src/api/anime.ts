// api/anime.ts
import { db } from "../database";
import { t } from "elysia";

const ITEMS_PER_PAGE = 10;

export const animeRoutes = (app: any) => {
  app.get("/api/anime", ({ query }: { query: { page?: string, filter?: string } }) => {
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
  });

  app.post("/api/anime", ({ body }: { body: { titles: string, status: string } }) => {
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
  });

  app.put("/api/anime/:id", ({ params, body }: { params: { id: number }, body: { title: string, status: string } }) => {
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
  });

  app.delete("/api/anime/:id", ({ params }: { params: { id: number } }) => {
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
  });
};
