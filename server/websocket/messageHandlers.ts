import type { WSMessage, GameUser, WebSocketPeer } from "./types";
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
import { delay } from "~/utils/delay";

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
        updateRoomStatus(gameId, room.prevStatus!, room.status);
        console.log(`${data.username} host connection repaired`);
      } else {
        console.log(`${data.username} is already HOST`);
      }
    } else {
      // Гость подключается или переподключается
      if (room.status == "guestConnectionRepairingWaiting") {
        updateRoomStatus(gameId, room.prevStatus!, room.status);
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

  // Сохраняем предыдущий статус
  if (room) {
    room.prevStatus = room.status;
  }

  // Отправляем подтверждение подключения
  sendMessage(peer, {
    type: "game:joined",
    data: {
      game: gameResponse,
      isHost,
    },
  });

  // Уведомляем других игроков об обновлении
  broadcastToRoom(
    gameId,
    {
      type: "game:update",
      data: { game: gameResponse },
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
    await delay(5000);

    // Переключeние статусa игры в актвную стадию
    game.status = `${
      game.firstArranged || (gamePeer.isHost ? "guest" : "host")
    }Turn`;

    broadcastToRoom(gamePeer.gameId, {
      type: "game:update",
      data: { status: game.status },
    });
  }
}
