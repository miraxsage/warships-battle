import type { WSMessage, WebSocketPeer } from "./types";

/**
 * Парсит WebSocket сообщение и валидирует его структуру
 */
export function parseMessage(message: any): WSMessage | null {
  try {
    const wsMessage: WSMessage = JSON.parse(message.text());

    if (!wsMessage.type || !("data" in wsMessage) || !wsMessage.data) {
      return null;
    }

    return wsMessage;
  } catch (parseError) {
    return null;
  }
}

/**
 * Отправляет ошибку через WebSocket соединение
 */
export function sendError(peer: WebSocketPeer, error: string): void {
  peer.send(
    JSON.stringify({
      type: "error",
      error,
    })
  );
}

/**
 * Отправляет любое сообщение через WebSocket соединение
 */
export function sendMessage(peer: WebSocketPeer, message: WSMessage): void {
  peer.send(JSON.stringify(message));
}

/**
 * Безопасно преобразует peer из crossws в наш WebSocketPeer интерфейс
 */
export function toPeer(peer: any): WebSocketPeer {
  return peer as WebSocketPeer;
}

/**
 * Логирует WebSocket сообщение для отладки
 */
export function logMessage(type: string, ...data: any[]): void {
  console.log(`[WS] ${type}:`, JSON.stringify(data, null, 2));
}

/**
 * Завершает игру когда игрок сбежал, очищает комнату и обновляет БД
 */
export async function finishGameAsEscaped(
  gameId: string,
  hostIsLoser: boolean
): Promise<void> {
  const hostScore = hostIsLoser ? -10 : 10;
  const guestScore = hostIsLoser ? 10 : -10;
  const status = hostIsLoser ? "host_escaped" : "guest_escaped";
  return finishGame(gameId, hostScore, guestScore, status);
}

/**
 * Завершает игру когда игрок не успел вовремя разместить корабли
 */
export async function finishGameAsArrangementLose(
  gameId: string,
  hostIsLoser: boolean
): Promise<void> {
  const hostScore = hostIsLoser ? -5 : 5;
  const guestScore = hostIsLoser ? 5 : -5;
  const status = hostIsLoser
    ? "host_arrangement_lose"
    : "guest_arrangement_lose";
  return finishGame(gameId, hostScore, guestScore, status);
}

/**
 * Завершает игру, сохраняет результаты в БД и очищает комнату
 */
export async function finishGame(
  gameId: string,
  hostScore: number,
  guestScore: number,
  status?: string
): Promise<void> {
  const { db } = await import("~/server/db/database");
  const { deleteGameRoom, getGameRoom } = await import("./gameRoom");

  const room = getGameRoom(gameId);
  if (!room?.hostUser?.id || !room?.guestUser?.id) {
    console.error("Cannot finish game: missing user data", gameId);
    return;
  }

  const finalWinnerId =
    hostScore > guestScore ? room.hostUser.id : room.guestUser.id;

  return new Promise<void>((resolve, reject) => {
    db.run(
      `UPDATE games 
       SET status = ?,
           host_score = ?,
           guest_score = ?,
           winner_id = ?,
           finished_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status ?? "finished", hostScore, guestScore, finalWinnerId, gameId],
      function (err) {
        if (err) {
          console.error("Error finishing game:", err);
          reject(err);
          return;
        }

        // Очищаем комнату
        deleteGameRoom(gameId);

        console.log(
          `Game ${gameId} completed. Winner: ${finalWinnerId}, Scores: host=${hostScore}, guest=${guestScore}, Room cleared.`
        );
        resolve();
      }
    );
  });
}
