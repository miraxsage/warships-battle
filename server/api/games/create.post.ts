import { db } from "~/server/db/database";
import { getUserFromToken } from "~/server/utils/auth";
import { randomBytes } from "crypto";
import { getGameRoom } from "~/server/websocket/gameRoom";

// Функция для очистки игр, которые есть в БД но нет среди активных комнат
function cleanupOldGames(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Получаем все игры со статусом NULL
    db.all(
      `SELECT id FROM games WHERE status IS NULL`,
      function (err, rows: { id: string }[]) {
        if (err) {
          console.error("Error getting old games:", err);
          reject(err);
          return;
        }

        // Импортируем getGameRoom для проверки комнат

        // Фильтруем игры, которых нет среди активных комнат
        const gamesToDelete = rows.filter((row) => !getGameRoom(row.id));
        console.log("gamesToDelete", gamesToDelete);

        if (gamesToDelete.length === 0) {
          resolve();
          return;
        }

        // Удаляем игры, которых нет среди комнат
        const placeholders = gamesToDelete.map(() => "?").join(",");
        const gameIds = gamesToDelete.map((row) => row.id);

        db.run(
          `DELETE FROM games WHERE id IN (${placeholders})`,
          gameIds,
          function (deleteErr) {
            if (deleteErr) {
              console.error("Error deleting old games:", deleteErr);
              reject(deleteErr);
              return;
            }
            console.log(`Cleaned up ${gamesToDelete.length} old games`);
            resolve();
          }
        );
      }
    );
  });
}

export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Очищаем старые игры перед созданием новой
  try {
    await cleanupOldGames();
  } catch (error) {
    console.error("Failed to cleanup old games:", error);
  }

  const gameId = randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO games (id, host_user_id) VALUES (?, ?)`,
      [gameId, user.id],
      function (err) {
        if (err) {
          console.error(err);
          reject(
            createError({
              statusCode: 500,
              statusMessage: "Failed to create game",
            })
          );
          return;
        }

        resolve({
          gameId,
          url: `${getRequestURL(event).origin}/game?peer=${gameId}`,
        });
      }
    );
  });
});
