import type { WSMessage, Game, GameUser, GameStatus } from "~/types/game";
import type { ShipState } from "~/types/game";
import { Scheduler } from "./scheduler";

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

export interface GameRoom {
  id: string;
  hostUser: GameUser;
  guestUser?: GameUser;
  hostArrangement?: ShipState[];
  guestArrangement?: ShipState[];
  firstArranged?: "host" | "guest";
  status: GameStatus;
  beforeLostConnectionStatus?: GameStatus;
  prevStatus?: GameStatus;
  turnNumber?: number;
  deferredOperation: () => Scheduler | undefined;
  deferOperation: (handler: () => void, delay: number) => Scheduler;
  gameData?: any;
  createdAt: Date;
  players: Set<GamePeer>;
}

export { type WSMessage, type Game, type GameUser, type GameStatus };
