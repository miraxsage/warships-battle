import type { GameStatus, WebSocketPeer } from "./types";
import { getGamePeer, removeGamePeer } from "./peerManager";
import {
  getGameRoom,
  removePlayerFromRoom,
  updateRoomStatus,
  broadcastToRoom,
} from "./gameRoom";
import { finishGameAsEscaped } from "./utils";
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
  room.deferredOperation()?.stop();

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

  // Сохраняем текущий статус перед потерей соединения
  if (!room.status.endsWith("ConnectionRepairingWaiting")) {
    room.beforeLostConnectionStatus = room.status;
  }

  updateRoomStatus(gameId, repairStatus);

  // Уведомляем других игроков о потере соединения
  broadcastToRoom(gameId, {
    type: "game:update",
    data: {
      status: repairStatus,
    },
  });

  // Ждем переподключения
  await delay(60000);

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
      data: { userId: gamePeer.userId, status: updatedRoom.status },
    });

    // Если игра была в процессе, помечаем как завершенную
    if (
      updatedRoom.beforeLostConnectionStatus &&
      (updatedRoom.beforeLostConnectionStatus === "hostTurn" ||
        updatedRoom.beforeLostConnectionStatus === "guestTurn" ||
        updatedRoom.beforeLostConnectionStatus.match(/arrangement/i)) &&
      updatedRoom.guestUser
    ) {
      try {
        await finishGameAsEscaped(gameId, !!gamePeer.isHost);
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
