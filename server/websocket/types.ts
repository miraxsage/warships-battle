import type { WSMessage, Game, GameUser, GameStatus } from "~/types/game";
import { ShipState } from "~/stores/field";

// Описываем только то, что нам нужно от peer объекта
export interface WebSocketPeer {
  id: string;
  send(data: string): void;
}

export interface GamePeer {
  peer: WebSocketPeer;
  userId: number;
  username: string;
  avatar: number;
  gameId?: string;
  isHost?: boolean;
}

export type Arrangement = Pick<ShipState, "type" | "x" | "y" | "rotation">;

export interface GameRoom {
  id: string;
  hostUser: GameUser;
  guestUser?: GameUser;
  hostArrangement?: Arrangement[];
  guestArrangement?: Arrangement[];
  firstArranged?: "host" | "guest";
  status: GameStatus;
  prevStatus?: GameStatus;
  gameData?: any;
  createdAt: Date;
  players: Set<GamePeer>;
}

export { type WSMessage, type Game, type GameUser, type GameStatus };
