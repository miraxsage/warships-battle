import {
  handleGameJoin,
  handleGameMove,
  handleGameArranged,
} from "~/server/websocket/messageHandlers";
import { handleDisconnection } from "~/server/websocket/connectionManager";
import {
  parseMessage,
  sendError,
  toPeer,
  logMessage,
} from "~/server/websocket/utils";

export default defineWebSocketHandler({
  open(peer) {
    console.log("WebSocket connection opened, peer ID:", peer.id);
    // Пир будет добавлен в комнату после получения от него сообщения game:join
  },

  async message(peer, message) {
    try {
      const wsMessage = parseMessage(message);

      if (!wsMessage) {
        sendError(toPeer(peer), "Неверная структура сообщения");
        return;
      }

      logMessage(wsMessage.type, peer.id, wsMessage.data);

      const webSocketPeer = toPeer(peer);

      switch (wsMessage.type) {
        case "game:join":
          await handleGameJoin(webSocketPeer, wsMessage.data);
          break;

        case "game:arranged":
          await handleGameArranged(webSocketPeer, wsMessage.data);
          break;

        case "game:move":
          await handleGameMove(webSocketPeer, wsMessage.data, wsMessage);
          break;

        default:
          sendError(
            webSocketPeer,
            `Неизвестный тип сообщения: ${wsMessage.type}`
          );
          break;
      }
    } catch (error) {
      console.error("WebSocket error:", error);
      sendError(toPeer(peer), "Внутренняя ошибка сервера");
    }
  },

  async close(peer) {
    await handleDisconnection(toPeer(peer));
  },
});
