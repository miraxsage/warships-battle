import type { GameStatus, WebSocketPeer } from "./types";
import { getGamePeer, removeGamePeer } from "./peerManager";
import {
  getGameRoom,
  removePlayerFromRoom,
  updateRoomStatus,
  broadcastToRoom,
} from "./gameRoom";
import { finishGameAsEscaped } from "./utils";

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

  // Приостанавливаем игровой таймер текущего хода, в ожидании переподключения
  room.deferredOperation()?.stop();

  const gameId = gamePeer.gameId;

  console.log(
    `${
      gamePeer.isHost ? "Host" : "Guest"
    } connection lost, waiting 60 seconds for repairing`,
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

  // Устанавливаем таймер ожидания переподключения игрока за 60 секунд,
  // иначе игра завершится автоматически
  room.deferDisconnectOperation(async () => {
    const updatedRoom = getGameRoom(gameId);
    if (!updatedRoom) {
      return;
    }

    // Удаляем игрока из комнаты
    const roomDeleted = removePlayerFromRoom(gameId, gamePeer);
    removeGamePeer(peer);
    console.log("Removing player from game:", gameId, "user:", gamePeer.userId);

    if (roomDeleted) {
      // Все игроки отключились - комната удалена
      console.log("All players disconnected, room deleted:", gameId);
    } else {
      // Остался один игрок - уведомляем его
      broadcastToRoom(gameId, {
        type: "game:left",
        data: {
          status: gamePeer.isHost ? "hostExited" : "guestExited",
        },
      });

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
  }, 60000);
}
