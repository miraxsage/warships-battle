import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "warships.db");

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath);

export function initDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          avatar INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          db.run(
            `
            CREATE TABLE IF NOT EXISTS sessions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              token TEXT UNIQUE NOT NULL,
              user_id INTEGER NOT NULL,
              expires_at DATETIME NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
          `,
            (sessionErr) => {
              if (sessionErr) {
                reject(sessionErr);
                return;
              }

              db.run(
                `
                CREATE TABLE IF NOT EXISTS games (
                  id TEXT PRIMARY KEY,
                  host_user_id INTEGER NOT NULL,
                  guest_user_id INTEGER NULL,
                  status TEXT NULL CHECK (status IN (
                    'finished', 
                    'host_arrangement_lost', 
                    'guest_arrangement_lost',
                    'host_escaped', 
                    'guest_escaped'
                  )),
                  host_score INTEGER NULL DEFAULT 0,
                  guest_score INTEGER NULL DEFAULT 0,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  finished_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (host_user_id) REFERENCES users (id) ON DELETE CASCADE,
                  FOREIGN KEY (guest_user_id) REFERENCES users (id) ON DELETE CASCADE
                )
              `,
                (gameErr) => {
                  if (gameErr) {
                    reject(gameErr);
                  } else {
                    resolve();
                  }
                }
              );
            }
          );
        }
      );
    });
  });
}

export function closeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
