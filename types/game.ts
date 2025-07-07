export interface GameUser {
  id: number;
  username: string;
  avatar: number;
}

export interface Game {
  id: string;
  hostUser: GameUser;
  guestUser?: GameUser;
  status: "waiting" | "preparing" | "playing" | "finished" | "exited";
  gameData?: any;
  createdAt: string;
  updatedAt?: string;
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
  | "game:left"
  | "game:start"
  | "game:move"
  | "game:update"
  | "game:end"
  | "error";

export interface WSMessage<T = any> {
  type: WSMessageType;
  gameId?: string;
  data?: T;
  error?: string;
}

export interface WSGameJoinData {
  gameId: string;
}

export interface WSGameJoinedData {
  game: Game;
  isHost: boolean;
}

export interface WSGameUpdateData {
  game: Game;
}
