// server.ts
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { animeRoutes } from "./api/anime";
import { libraryRoutes } from "./api/library";

const app = new Elysia().use(cors());

animeRoutes(app);
libraryRoutes(app);

app.listen(3001);

console.log(`Server is running at http://localhost:${app.server?.port}`);
