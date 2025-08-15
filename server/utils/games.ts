import { GameStatus } from "~/types/game";
import { db } from "../db/database";
import { getGameRoom } from "../websocket/gameRoom";

export interface GameStatusDetailed {
  gameId: string;
  status: GameStatus | null;
  isFinished: boolean;
}

export async function getGameStatus(
  gameId: string
): Promise<GameStatusDetailed | null> {
  return new Promise((resolve, reject) => {
    const room = getGameRoom(gameId);
    if (!room) {
      resolve(null);
      return;
    }
    console.log("room check status is found", room);

    db.get(
      `SELECT status FROM games WHERE id = ?`,
      [gameId],
      function (err, row: { status: string | null } | undefined) {
        if (err) {
          console.error("Error checking game status:", err);
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve({
          gameId,
          status: row.status as GameStatus | null,
          isFinished: row.status !== null,
        });
      }
    );
  });
}
