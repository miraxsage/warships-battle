import { type Peer, type AdapterInternal } from "crossws";
import type { WSMessage, Game, GameUser } from "~/types/game";
import { db } from "../db/database";

interface GamePeer {
  peer: Peer<AdapterInternal>;
  userId: number;
  username: string;
  avatar: number;
  gameId?: string;
  isHost?: boolean;
}

interface GameRoom {
  id: string;
  hostUser: GameUser;
  guestUser?: GameUser;
  status: "waiting" | "preparing" | "playing" | "finished";
  gameData?: any;
  createdAt: Date;
  players: Set<GamePeer>;
}

const gamePeers = new Map<Peer<AdapterInternal>, GamePeer>();
const gameRooms = new Map<string, GameRoom>();

function broadcastToRoom(
  gameId: string,
  message: WSMessage,
  excludePeer?: Peer<AdapterInternal>
) {
  const room = gameRooms.get(gameId);
  if (!room) return;

  room.players.forEach(({ peer }) => {
    if (peer !== excludePeer) {
      try {
        peer.send(JSON.stringify(message));
      } catch (error) {
        console.error("Failed to send message to peer:", error);
      }
    }
  });
}

function saveGameResult(
  gameId: string,
  hostUserId: number,
  guestUserId: number,
  status: "finished" | "exited",
  hostScore: number = 0,
  guestScore: number = 0,
  winnerId: number | null = null
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO games (id, host_user_id, guest_user_id, status, host_score, guest_score, winner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        gameId,
        hostUserId,
        guestUserId,
        status,
        hostScore,
        guestScore,
        winnerId,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export default defineWebSocketHandler({
  open(peer) {
    console.log("WebSocket connection opened, peer ID:", peer.id);
    // Пир будет добавлен в комнату после получения сообщения game:join
  },

  async message(peer, message) {
    try {
      let wsMessage: WSMessage;
      try {
        wsMessage = JSON.parse(message.text());
      } catch (parseError) {
        console.error("Failed to parse WebSocket message:", parseError);
        peer.send(
          JSON.stringify({
            type: "error",
            error: "Invalid JSON format",
          })
        );
        return;
      }

      if (!wsMessage.type || !wsMessage.data) {
        peer.send(
          JSON.stringify({
            type: "error",
            error: "Invalid message structure",
          })
        );
        return;
      }

      const gamePeer = gamePeers.get(peer);

      switch (wsMessage.type) {
        case "game:join": {
          const { gameId } = wsMessage.data;
          if (
            !gameId ||
            !wsMessage.data.userId ||
            !wsMessage.data.username ||
            wsMessage.data.avatar === undefined
          ) {
            peer.send(
              JSON.stringify({
                type: "error",
                error: "Missing required data",
              })
            );
            return;
          }

          // Проверяем, не подключен ли уже этот пользователь к игре
          const existingPeer = Array.from(gamePeers.values()).find(
            (p) => p.userId === wsMessage.data.userId && p.gameId === gameId
          );
          if (existingPeer) {
            peer.send(
              JSON.stringify({
                type: "error",
                error: "User already connected to this game",
              })
            );
            return;
          }

          // Получаем или создаем игровую комнату
          let room = gameRooms.get(gameId);
          let isHost = false;
          let gameResponse: Game;

          if (!room) {
            // Первый игрок (хост) создает комнату
            isHost = true;
            gameResponse = {
              id: gameId,
              hostUser: {
                id: wsMessage.data.userId,
                username: wsMessage.data.username,
                avatar: wsMessage.data.avatar,
              },
              guestUser: undefined,
              status: "waiting",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          } else {
            // Второй игрок (гость) присоединяется
            if (room.guestUser) {
              peer.send(
                JSON.stringify({
                  type: "error",
                  error: "Game is full",
                })
              );
              return;
            }

            isHost = room.hostUser.id === wsMessage.data.userId;

            if (!isHost) {
              // Добавляем гостя
              room.guestUser = {
                id: wsMessage.data.userId,
                username: wsMessage.data.username,
                avatar: wsMessage.data.avatar,
              };
              room.status = "preparing";
            }

            gameResponse = {
              id: room.id,
              hostUser: room.hostUser,
              guestUser: room.guestUser,
              status: room.status,
              createdAt: room.createdAt.toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }

          // Создаем GamePeer
          const newGamePeer: GamePeer = {
            peer,
            userId: wsMessage.data.userId,
            username: wsMessage.data.username,
            avatar: wsMessage.data.avatar,
            gameId,
            isHost,
          };

          gamePeers.set(peer, newGamePeer);
          console.log(
            "Player joined game:",
            gameId,
            "user:",
            wsMessage.data.username,
            "isHost:",
            isHost
          );

          // Добавляем в комнату
          if (!gameRooms.has(gameId)) {
            gameRooms.set(gameId, {
              id: gameId,
              hostUser: gameResponse.hostUser,
              guestUser: gameResponse.guestUser,
              status: gameResponse.status as
                | "waiting"
                | "preparing"
                | "playing"
                | "finished",
              createdAt: new Date(),
              players: new Set(),
            });
          }
          gameRooms.get(gameId)!.players.add(newGamePeer);

          // Отправляем подтверждение подключения
          peer.send(
            JSON.stringify({
              type: "game:joined",
              data: {
                game: gameResponse,
                isHost,
              },
            })
          );

          // Уведомляем других игроков об обновлении
          console.log(
            "Broadcasting game update to room:",
            gameId,
            "game:",
            gameResponse
          );
          broadcastToRoom(
            gameId,
            {
              type: "game:update",
              data: { game: gameResponse },
            },
            peer
          );

          break;
        }

        case "game:move":
        case "game:start": {
          if (!gamePeer?.gameId) return;

          // Пересылаем сообщение другим игрокам в комнате
          broadcastToRoom(gamePeer.gameId, wsMessage, peer);
          break;
        }
      }
    } catch (error) {
      console.error("WebSocket error:", error);
      peer.send(
        JSON.stringify({
          type: "error",
          error: "Invalid message format",
        })
      );
    }
  },

  async close(peer) {
    console.log("WebSocket connection closed, peer ID:", peer.id);
    const gamePeer = gamePeers.get(peer);
    if (gamePeer?.gameId) {
      console.log(
        "Removing player from game:",
        gamePeer.gameId,
        "user:",
        gamePeer.userId
      );
      const room = gameRooms.get(gamePeer.gameId);
      if (room) {
        room.players.delete(gamePeer);

        if (room.players.size === 0) {
          // Все игроки отключились - удаляем комнату из памяти
          console.log(
            "All players disconnected, removing room:",
            gamePeer.gameId
          );

          // Если игра была начата (есть оба игрока), сохраняем результат как "exited"
          if (room.hostUser && room.guestUser && room.status !== "waiting") {
            try {
              await saveGameResult(
                gamePeer.gameId,
                room.hostUser.id,
                room.guestUser.id,
                "exited"
              );
              console.log("Game result saved as 'exited':", gamePeer.gameId);
            } catch (error) {
              console.error("Error saving game result:", error);
            }
          }

          gameRooms.delete(gamePeer.gameId);
        } else {
          // Остался один игрок - уведомляем его
          console.log(
            "Player left, notifying remaining players:",
            gamePeer.userId
          );
          broadcastToRoom(gamePeer.gameId, {
            type: "game:left",
            data: { userId: gamePeer.userId },
          });

          // Если игра была начата, сохраняем результат как "exited"
          if (room.hostUser && room.guestUser && room.status !== "waiting") {
            try {
              await saveGameResult(
                gamePeer.gameId,
                room.hostUser.id,
                room.guestUser.id,
                "exited"
              );
              console.log(
                "Game result saved as 'exited' due to player disconnect:",
                gamePeer.gameId
              );
            } catch (error) {
              console.error("Error saving game result:", error);
            }
          }
        }
      }
    }
    gamePeers.delete(peer);
  },
});
