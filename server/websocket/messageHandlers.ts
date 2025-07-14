import type { WSMessage, GameUser, WebSocketPeer, GameRoom } from "./types";
import { addGamePeer, getGamePeer, isPeerConnected } from "./peerManager";
import {
  getGameRoom,
  createGameRoom,
  joinGameRoom,
  addPlayerToRoom,
  updateRoomStatus,
  createGameResponse,
  broadcastToRoom,
} from "./gameRoom";
import { sendMessage, sendError } from "./utils";

function scheduleGameTurn(
  game: GameRoom,
  turnFor: "host" | "guest",
  delay = 0
) {
  const gameId = game.id;
  game.deferOperation(() => {
    game.status = `${turnFor}Turn`;

    if (!game.turnNumber) {
      game.turnNumber = 0;
    }
    game.turnNumber += 1;

    broadcastToRoom(gameId, {
      type: "game:update",
      data: { status: game.status, game: createGameResponse(game) },
    });

    game.deferOperation(
      () => {
        game.status = `${turnFor}TurnLost`;

        broadcastToRoom(gameId, {
          type: "game:update",
          data: { status: game.status },
        });
        scheduleGameTurn(game, turnFor == "host" ? "guest" : "host", 10000);
      },
      game.turnNumber == 1 ? 46000 : 31000
    );
  }, delay);
}

export async function handleGameJoin(
  peer: WebSocketPeer,
  data: any
): Promise<void> {
  const { gameId } = data;

  if (!gameId || !data.userId || !data.username || !data.avatar) {
    sendError(peer, "Необходимые данные отсутствуют");
    return;
  }

  // Проверяем не подключен ли уже этот пользователь к игре
  if (isPeerConnected(peer)) {
    sendError(peer, "Вы уже подключены к серверу");
    return;
  }

  let room = getGameRoom(gameId);
  let isHost = false;
  let gameResponse;

  console.log(
    `GameID: ${gameId}, Room exists: ${!!room}, User: ${data.username} (ID: ${
      data.userId
    })`
  );

  if (!room) {
    // Первый игрок (хост) создает комнату
    isHost = true;
    const hostUser: GameUser = {
      id: data.userId,
      username: data.username,
      avatar: data.avatar,
    };

    room = createGameRoom(gameId, hostUser);
    gameResponse = createGameResponse(room);
  } else {
    // Второй игрок или переподключение
    console.log(
      `Room exists! Host: ${room.hostUser.username} (ID: ${room.hostUser.id}), Current user: ${data.username} (ID: ${data.userId})`
    );

    if (
      room.guestUser &&
      room.guestUser.id !== data.userId &&
      room.hostUser &&
      room.hostUser.id !== data.userId
    ) {
      sendError(
        peer,
        "Нельзя присоединиться к игре, она уже началась c другим игроком"
      );
      return;
    }

    isHost = room.hostUser.id === data.userId;

    if (isHost) {
      // Хост переподключается
      if (room.status == "hostConnectionRepairingWaiting") {
        updateRoomStatus(gameId, room.beforeLostConnectionStatus!, room.status);
        room.deferredOperation()?.start();
        console.log(`${data.username} host connection repaired`);
      } else {
        console.log(`${data.username} is already HOST`);
      }
    } else {
      // Гость подключается или переподключается
      if (room.status == "guestConnectionRepairingWaiting") {
        updateRoomStatus(gameId, room.beforeLostConnectionStatus!, room.status);
        room.deferredOperation()?.start();
        console.log(`${data.username} guest connection repaired`);
      } else {
        // Добавляем нового гостя
        const guestUser: GameUser = {
          id: data.userId,
          username: data.username,
          avatar: data.avatar,
        };
        joinGameRoom(gameId, guestUser);
      }
    }

    gameResponse = createGameResponse(room);
  }

  // Создаем GamePeer
  const newGamePeer = addGamePeer(peer, {
    userId: data.userId,
    username: data.username,
    avatar: data.avatar,
    gameId,
    isHost,
  });

  // Добавляем в комнату
  addPlayerToRoom(gameId, newGamePeer);

  // Сохраняем текущий статус как предыдущий, если он не connectionRepairingWaiting
  if (room && !room.status.endsWith("ConnectionRepairingWaiting")) {
    room.beforeLostConnectionStatus = room.status;
  }

  // Отправляем подтверждение подключения
  sendMessage(peer, {
    type: "game:joined",
    data: {
      status: gameResponse.status,
      game: gameResponse,
      isHost,
    },
  });

  // Уведомляем других игроков об обновлении
  broadcastToRoom(
    gameId,
    {
      type: "game:update",
      data: {
        game: gameResponse,
        status: room.status,
      },
    },
    peer
  );
}

export async function handleGameMove(
  peer: WebSocketPeer,
  data: any,
  wsMessage: WSMessage
): Promise<void> {
  const gamePeer = getGamePeer(peer);
  if (!gamePeer?.gameId) return;
  const game = getGameRoom(gamePeer.gameId);
  if (!game) return;

  // Увеличиваем номер хода
  if (game.turnNumber) {
    game.turnNumber++;
  }

  // Пересылаем сообщение другим игрокам в комнате
  broadcastToRoom(gamePeer.gameId, wsMessage, peer);
}

export async function handleGameArranged(
  peer: WebSocketPeer,
  data: any
): Promise<void> {
  const gamePeer = getGamePeer(peer);
  if (!gamePeer?.gameId) return;
  const game = getGameRoom(gamePeer.gameId);
  if (!game) return;
  const gameId = gamePeer.gameId;

  console.log(`Player ${gamePeer.username} arranged ships:`, data.arrangement);

  game[gamePeer.isHost ? "hostArrangement" : "guestArrangement"] =
    data.arrangement;
  const isFirstArranged = !game.firstArranged;
  if (isFirstArranged) {
    game.firstArranged = gamePeer.isHost ? "host" : "guest";
    game.status = `${gamePeer.isHost ? "guest" : "host"}ArrangementWaiting`;
  } else {
    game.status = "arrangementFinished";
  }

  broadcastToRoom(gamePeer.gameId, {
    type: "game:update",
    data: { status: game.status, firstArranged: game.firstArranged },
  });

  if (game.status == "arrangementFinished") {
    // Ожидение уведомления пользователей о готовности к игре
    // и планирование следующего сообщения о начале игры
    scheduleGameTurn(game, game.firstArranged!, 16000);
  }
}

export async function handleGameReset(peer: WebSocketPeer): Promise<void> {
  const gamePeer = getGamePeer(peer);
  if (!gamePeer?.gameId) return;
  const game = getGameRoom(gamePeer.gameId);
  if (!game) return;
  game.deferredOperation()?.stop();

  console.log(`Player ${gamePeer.username} reset game:`, gamePeer.gameId);

  // Сбрасываем состояние игры до arrangement
  game.status = "arrangement";
  game.hostArrangement = undefined;
  game.guestArrangement = undefined;
  game.firstArranged = undefined;
  game.turnNumber = undefined;

  // Уведомляем всех игроков о сбросе
  broadcastToRoom(gamePeer.gameId, {
    type: "game:update",
    data: { status: game.status },
  });
}
