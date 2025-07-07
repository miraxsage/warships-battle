import { db } from "~/server/db/database";
import { getUserFromToken } from "~/server/utils/auth";
import { randomBytes } from "crypto";

export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const gameId = randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO games (id, host_user_id) VALUES (?, ?)`,
      [gameId, user.id],
      function (err) {
        if (err) {
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
