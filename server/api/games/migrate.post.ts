import { db } from "~/server/db/database";

export default defineEventHandler(async (event) => {
  // Только для разработки - в продакшене убрать или добавить авторизацию
  if (process.env.NODE_ENV === "production") {
    throw createError({
      statusCode: 403,
      statusMessage: "Migration not allowed in production",
    });
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Удаляем старую таблицу
      db.run("DROP TABLE IF EXISTS games", (err) => {
        if (err) {
          reject(
            createError({
              statusCode: 500,
              statusMessage: "Failed to drop old table",
            })
          );
          return;
        }

        // Создаем новую таблицу
        db.run(
          `
          CREATE TABLE games (
            id TEXT PRIMARY KEY,
            host_user_id INTEGER NOT NULL,
            guest_user_id INTEGER NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('finished', 'exited')),
            host_score INTEGER NOT NULL DEFAULT 0,
            guest_score INTEGER NOT NULL DEFAULT 0,
            winner_id INTEGER DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            finished_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (host_user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (guest_user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (winner_id) REFERENCES users (id) ON DELETE SET NULL
          )
          `,
          (createErr) => {
            if (createErr) {
              reject(
                createError({
                  statusCode: 500,
                  statusMessage: "Failed to create new table",
                })
              );
            } else {
              resolve({
                success: true,
                message: "Games table migrated successfully",
              });
            }
          }
        );
      });
    });
  });
});
