import type { GameStatus, WebSocketPeer } from "./types";
import { getGamePeer, removeGamePeer } from "./peerManager";
import {
  getGameRoom,
  removePlayerFromRoom,
  updateRoomStatus,
  broadcastToRoom,
} from "./gameRoom";
import { updateGameFinished } from "./utils";
import { delay } from "~/utils/delay";

export async function handleDisconnection(peer: WebSocketPeer): Promise<void> {
  console.log("WebSocket connection closed, peer ID:", peer.id);

  const gamePeer = getGamePeer(peer);
  if (!gamePeer?.gameId) {
    removeGamePeer(peer);
    return;
  }

  const room = getGameRoom(gamePeer.gameId);
  if (!room) {
    removeGamePeer(peer);
    return;
  }

  const gameId = gamePeer.gameId;

  console.log(
    `${
      gamePeer.isHost ? "Host" : "Guest"
    } connection lost, waiting 30 seconds for repairing`,
    gameId,
    "user:",
    gamePeer.userId
  );

  // Устанавливаем статус ожидания переподключения
  const repairStatus = `${
    gamePeer.isHost ? "host" : "guest"
  }ConnectionRepairingWaiting` as GameStatus;
  updateRoomStatus(gameId, repairStatus, room.status);

  // Уведомляем других игроков о потере соединения
  broadcastToRoom(gameId, {
    type: "game:update",
    data: {
      game: {
        status: repairStatus,
      },
    },
  });

  // Ждем переподключения (30 секунд в продакшене, 300 для тестов)
  await delay(300 * 1000);

  // Проверяем, переподключился ли игрок
  const updatedRoom = getGameRoom(gameId);
  if (
    !updatedRoom ||
    !updatedRoom.status.endsWith("ConnectionRepairingWaiting")
  ) {
    // Игрок переподключился или комната была удалена
    return;
  }

  console.log("Removing player from game:", gameId, "user:", gamePeer.userId);

  // Удаляем игрока из комнаты
  const roomDeleted = removePlayerFromRoom(gameId, gamePeer);
  removeGamePeer(peer);

  if (roomDeleted) {
    // Все игроки отключились - комната удалена
    console.log("All players disconnected, room deleted:", gameId);
  } else {
    // Остался один игрок - уведомляем его
    broadcastToRoom(gameId, {
      type: "game:left",
      data: { userId: gamePeer.userId },
    });

    // Если игра была в процессе, помечаем как завершенную
    if (
      updatedRoom.prevStatus &&
      (updatedRoom.prevStatus === "hostTurn" ||
        updatedRoom.prevStatus === "guestTurn" ||
        updatedRoom.prevStatus.match(/arrangement/i)) &&
      updatedRoom.guestUser
    ) {
      try {
        await updateGameFinished(
          gameId,
          updatedRoom.hostUser.id,
          updatedRoom.guestUser.id,
          !!gamePeer.isHost
        );
        console.log(
          `Game ${gameId} finished due to player disconnection. Escaped: ${
            gamePeer.isHost ? "host" : "guest"
          }`
        );
      } catch (error) {
        console.error("Error updating game status:", error);
      }
    }
  }
}

export function handleReconnection(gameId: string, userId: number): void {
  const room = getGameRoom(gameId);
  if (!room) return;

  // Проверяем, был ли этот игрок в состоянии переподключения
  const isHostReconnecting =
    room.status === "hostConnectionRepairingWaiting" &&
    room.hostUser?.id === userId;
  const isGuestReconnecting =
    room.status === "guestConnectionRepairingWaiting" &&
    room.guestUser?.id === userId;

  if (isHostReconnecting || isGuestReconnecting) {
    // Восстанавливаем предыдущий статус
    if (room.prevStatus) {
      updateRoomStatus(gameId, room.prevStatus);
      console.log(`Player ${userId} reconnected to game ${gameId}`);
    }
  }
}
