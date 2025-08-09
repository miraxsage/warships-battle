import { Scheduler } from "./scheduler";
import type {
  GameRoom,
  GamePeer,
  WSMessage,
  GameUser,
  GameStatus,
  Game,
  WebSocketPeer,
} from "./types";
import { sendMessage } from "./utils";
import { removeGamePeer } from "./peerManager";

const gameRooms = new Map<string, GameRoom>();

export function broadcastToRoom(
  gameId: string,
  message: WSMessage,
  excludePeer?: WebSocketPeer
) {
  const room = gameRooms.get(gameId);
  if (!room) return;

  room.players.forEach(({ peer }) => {
    if (peer !== excludePeer) {
      try {
        sendMessage(peer, message);
      } catch (error) {
        console.error("Failed to send message to peer:", error);
      }
    }
  });
}

export function createGameRoom(gameId: string, hostUser: GameUser): GameRoom {
  console.log(`Creating new room, ${hostUser.username} becomes HOST`);

  let deferredOperation: Scheduler | undefined;

  const room: GameRoom = {
    id: gameId,
    hostUser,
    guestUser: undefined,
    status: "guestConnectionWaiting",
    createdAt: new Date(),
    players: new Set(),
    deferredOperation: () => deferredOperation,
    deferOperation: (handler, delay) => {
      deferredOperation?.stop();
      return (deferredOperation = new Scheduler(handler, delay));
    },
  };

  gameRooms.set(gameId, room);
  return room;
}

export function getGameRoom(gameId: string): GameRoom | undefined {
  return gameRooms.get(gameId);
}

export function joinGameRoom(
  gameId: string,
  guestUser: GameUser
): GameRoom | null {
  const room = gameRooms.get(gameId);
  if (!room) return null;

  console.log(`${guestUser.username} becomes GUEST`);
  room.guestUser = guestUser;
  room.status = "arrangement";

  return room;
}

export function addPlayerToRoom(gameId: string, gamePeer: GamePeer): void {
  const room = gameRooms.get(gameId);
  if (room) {
    room.players.add(gamePeer);
  }
}

export function removePlayerFromRoom(
  gameId: string,
  gamePeer: GamePeer
): boolean {
  const room = gameRooms.get(gameId);
  if (!room) return false;

  room.players.delete(gamePeer);

  if (room.players.size === 0) {
    // Все игроки отключились - удаляем комнату
    gameRooms.delete(gameId);
    console.log("Room deleted:", gameId);
    return true;
  }

  return false;
}

export function updateRoomStatus(gameId: string, status: GameStatus): void {
  const room = gameRooms.get(gameId);
  if (room) {
    room.status = status;
  }
}

export function createGameResponse(room: GameRoom): Game {
  return {
    id: room.id,
    hostUser: room.hostUser,
    guestUser: room.guestUser,
    status: room.status,
    createdAt: room.createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    turnNumber: room.turnNumber,
  };
}

export function deleteGameRoom(gameId: string) {
  const room = gameRooms.get(gameId);
  if (!room) return;

  room.deferredOperation()?.stop();

  for (const gamePeer of room.players) {
    removeGamePeer(gamePeer.peer);
  }

  room.players.clear();

  const deleted = gameRooms.delete(gameId);

  if (deleted) {
    console.log("Game room deleted with all resources cleaned:", gameId);
  }
}
