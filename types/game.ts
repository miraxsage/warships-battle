import type { Coord, Rotation } from "./common";

export interface GameUser {
  id: number;
  username: string;
  avatar: number;
}

export type ShipState = {
  type: 1 | 2 | 3 | 4;
  x: Coord;
  y: Coord;
  rotation: Rotation;
};

export type ShipPart = {
  x: Coord;
  y: Coord;
  part: 0 | 1 | 2 | 3;
  ship: ShipState;
};

export type GameStatus =
  | "initial"
  | "connecting"
  | "joining"
  | "guestConnectionWaiting"
  | "arrangement"
  | "hostArrangementWaiting"
  | "guestArrangementWaiting"
  | "guestArrangementLose"
  | "hostArrangementLose"
  | "arrangementFinished"
  | "guestConnectionRepairingWaiting"
  | "hostConnectionRepairingWaiting"
  | "hostTurn"
  | "guestTurn"
  | "hostTurnFinished"
  | "guestTurnFinished"
  | "hostTurnLost"
  | "guestTurnLost"
  | "finished"
  | "hostExited"
  | "guestExited"
  | "failed";
export interface PlayerStats {
  turns: number; // Общее количество ходов игрока
  hits: number; // Количество попаданий
  misses: number; // Количество промахов
  skipped: number; // Количество пропущенных ходов
}

export interface Game {
  id: string;
  hostUser: GameUser;
  guestUser?: GameUser;
  status: GameStatus;
  // gameData?: any;
  createdAt: string;
  updatedAt?: string;
  gameStartedAt?: number; // Unix timestamp начала игры
  lastTurn?: {
    performer: "player" | "enemy";
    role: "host" | "guest";
    x: number;
    y: number;
    result: "hit" | "miss";
    isShipDestroyed?: boolean;
  };
  turnNumber?: number;
  // Поля для завершенных игр
  hostScore?: number;
  guestScore?: number;
  winnerId?: number;
  winnerUsername?: string;
  finishedAt?: string;
}

export type WSMessageType =
  | "game:join"
  | "game:joined"
  | "game:arranged"
  | "game:left"
  | "game:update"
  | "game:turn"
  | "game:turned"
  | "game:end"
  | "game:reset"
  | "game:restore"
  | "error";

export type WSMessage =
  | { type: "game:join"; gameId?: string; data: WSGameJoinData }
  | { type: "game:joined"; gameId?: string; data: WSGameJoinedData }
  | { type: "game:arranged"; gameId?: string; data: WSGameArrangedData }
  | { type: "game:left"; gameId?: string; data: WSGameLeftData }
  | { type: "game:update"; gameId?: string; data: WSGameUpdateData }
  | { type: "game:turn"; gameId?: string; data: WSGameTurnData }
  | { type: "game:turned"; gameId?: string; data: WSGameTurnedData }
  | { type: "game:end"; gameId?: string; data: WSGameEndData }
  | { type: "game:reset"; gameId?: string; data: WSGameResetData }
  | { type: "game:restore"; gameId?: string; data: WSGameRestoreData }
  | { type: "error"; gameId?: string; error: string };

export interface WSGameJoinData {
  gameId: string;
  userId: number;
  username: string;
  avatar: number;
}

export interface WSGameJoinedData {
  status: GameStatus;
  game: Game;
  isHost: boolean;
}

export interface WSGameUpdateData {
  status: GameStatus;
  turnNumber?: number;
  game?: Game;
  firstArranged?: "host" | "guest";
}

export interface WSGameArrangedData {
  arrangement: ShipState[]; // массив кораблей без id
}

export type FieldTurn =
  | {
      type: "hit" | "miss";
      count: number;
    }
  | undefined;

export interface WSGameTurnData {
  x: number;
  y: number;
}

export interface WSGameTurnedData {
  x: number;
  y: number;
  status: GameStatus;
  turn: FieldTurn;
  destroyedShip?: ShipState;
  turnsMap: FieldTurn[][];
}

export interface WSGameLeftData {
  status: GameStatus;
}

export interface WSGameEndData {
  status: GameStatus;
  winnerId?: number;
  reason?: string;
}

export interface WSGameResetData {
  gameId: string;
}

export interface WSGameRestoreData {
  playerArrangement: ShipState[];
  enemyArrangement: ShipState[];
  playerTurnsMap: FieldTurn[][];
  enemyTurnsMap: FieldTurn[][];
  turnNumber?: number;
  gameStartedAt?: number; // Unix timestamp начала игры
  playerStats?: PlayerStats; // Статистика игрока
  enemyStats?: PlayerStats; // Статистика противника
}

export interface WSErrorData {
  status: GameStatus;
  error: string;
}
