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
 * Обновляет игру в БД при завершении из-за отключения игрока
 */
export async function updateGameFinished(
  gameId: string,
  hostUserId: number,
  guestUserId: number,
  escapedIsHost: boolean
): Promise<void> {
  const { db } = await import("~/server/db/database");

  return new Promise<void>((resolve, reject) => {
    const hostScore = escapedIsHost ? -10 : 10;
    const guestScore = escapedIsHost ? 10 : -10;
    const winnerId = escapedIsHost ? guestUserId : hostUserId;

    db.run(
      `UPDATE games 
       SET guest_user_id = ?, 
           status = 'finished',
           host_score = ?,
           guest_score = ?,
           winner_id = ?,
           finished_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [guestUserId, hostScore, guestScore, winnerId, gameId],
      function (err) {
        if (err) {
          console.error("Error updating game status:", err);
          reject(err);
          return;
        }

        console.log(
          `Game ${gameId} finished. Winner: ${winnerId}, Scores: host=${hostScore}, guest=${guestScore}`
        );
        resolve();
      }
    );
  });
}
