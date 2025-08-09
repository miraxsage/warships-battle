import type {
  WSMessage,
  Game,
  GameUser,
  GameStatus,
  FieldTurn,
} from "~/types/game";
import type { ShipState } from "~/types/game";

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
  deferredOperation: () => any;
  deferOperation: (handler: () => void, delay: number) => any;
  gameData?: any;
  createdAt: Date;
  players: Set<GamePeer>;
}

export { type WSMessage, type Game, type GameUser, type GameStatus };
