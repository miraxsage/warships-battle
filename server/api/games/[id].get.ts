import { db } from "~/server/db/database";
import type { Game } from "~/types/game";

export default defineEventHandler(async (event) => {
  const gameId = getRouterParam(event, "id");

  if (!gameId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Game ID is required",
    });
  }

  return new Promise<Game | null>((resolve, reject) => {
    db.get(
      `
      SELECT 
        g.*,
        h.username as host_username, h.avatar as host_avatar,
        gu.username as guest_username, gu.avatar as guest_avatar,
        w.username as winner_username
      FROM games g
      JOIN users h ON g.host_user_id = h.id
      JOIN users gu ON g.guest_user_id = gu.id
      LEFT JOIN users w ON g.winner_id = w.id
      WHERE g.id = ?
      `,
      [gameId],
      (err, row: any) => {
        if (err) {
          reject(
            createError({
              statusCode: 500,
              statusMessage: "Database error",
            })
          );
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        const game: Game = {
          id: row.id,
          hostUser: {
            id: row.host_user_id,
            username: row.host_username,
            avatar: row.host_avatar,
          },
          guestUser: {
            id: row.guest_user_id,
            username: row.guest_username,
            avatar: row.guest_avatar,
          },
          status: row.status,
          hostScore: row.host_score,
          guestScore: row.guest_score,
          winnerId: row.winner_id,
          winnerUsername: row.winner_username,
          createdAt: row.created_at,
          finishedAt: row.finished_at,
        };

        resolve(game);
      }
    );
  });
});
