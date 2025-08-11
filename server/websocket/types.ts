import type {
  WSMessage,
  Game,
  GameUser,
  GameStatus,
  FieldTurn,
  WSGameRestoreData,
  PlayerStats,
} from "~/types/game";
import type { ShipState } from "~/types/game";
import { Scheduler } from "./scheduler";

export interface WebSocketPeer {
  id: string;
  send(data: string): void;
  close(code?: number, reason?: string): void;
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
  hostTurnsMap?: FieldTurn[][];
  guestArrangement?: ShipState[];
  guestTurnsMap?: FieldTurn[][];
  firstArranged?: "host" | "guest";
  status: GameStatus;
  beforeLostConnectionStatus?: GameStatus;
  turnNumber?: number;
  gameStartedAt?: number; // Unix timestamp начала игры
  // Статистика игроков
  hostStats?: PlayerStats;
  guestStats?: PlayerStats;
  // Игровой таймер (ходы/размещение и т.п.)
  deferredOperation: () => Scheduler | undefined;
  deferOperation: (handler: () => void, delay: number) => Scheduler;
  // Таймер ожидания переподключения
  disconnectOperation: () => Scheduler | undefined;
  deferDisconnectOperation: (handler: () => void, delay: number) => Scheduler;
  gameData?: any;
  createdAt: Date;
  players: Set<GamePeer>;
}

export {
  type WSMessage,
  type Game,
  type GameUser,
  type GameStatus,
  type WSGameRestoreData,
};
