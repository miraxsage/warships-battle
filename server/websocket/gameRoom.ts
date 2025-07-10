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

  const room: GameRoom = {
    id: gameId,
    hostUser,
    guestUser: undefined,
    status: "guestConnectionWaiting",
    createdAt: new Date(),
    players: new Set(),
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

export function updateRoomStatus(
  gameId: string,
  status: GameStatus,
  prevStatus?: GameStatus
): void {
  const room = gameRooms.get(gameId);
  if (room) {
    if (prevStatus !== undefined) {
      room.prevStatus = prevStatus;
    }
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
  };
}
