// database.ts
import { Database } from "bun:sqlite";

export const db = new Database("anime.db");

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
