import type { Game, WSMessage } from "~/types/game";

export const useGameStore = defineStore("game", () => {
  const currentGame = ref<Game | null>(null);
  const isConnected = ref(false);
  const isHost = ref(false);
  const connectionStatus = ref<"disconnected" | "connecting" | "connected">(
    "disconnected"
  );

  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  const userStore = useUserStore();

  function connect(gameId: string) {
    if (ws?.readyState === WebSocket.OPEN) return;

    connectionStatus.value = "connecting";

    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${location.host}/_ws`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      connectionStatus.value = "connected";
      isConnected.value = true;
      reconnectAttempts = 0;

      // Присоединяемся к игре
      sendMessage({
        type: "game:join",
        data: {
          gameId,
          userId: userStore.user?.id,
          username: userStore.user?.username,
          avatar: userStore.user?.avatar,
        },
      });
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      connectionStatus.value = "disconnected";
      isConnected.value = false;

      // Автоматическое переподключение
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setTimeout(() => connect(gameId), 1000 * reconnectAttempts);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  function handleMessage(message: WSMessage) {
    console.log("WebSocket message received:", message);
    switch (message.type) {
      case "game:joined":
        if (message.data) {
          console.log("Game joined:", message.data);
          console.log("Host user:", message.data.game?.hostUser);
          console.log("Guest user:", message.data.game?.guestUser);
          currentGame.value = message.data.game;
          isHost.value = message.data.isHost;
        }
        break;

      case "game:update":
        if (message.data?.game) {
          console.log("Game updated:", message.data.game);
          console.log("Updated Host user:", message.data.game?.hostUser);
          console.log("Updated Guest user:", message.data.game?.guestUser);
          currentGame.value = message.data.game;
        }
        break;

      case "game:left":
        // Обработка отключения игрока
        console.log("Player left:", message.data?.userId);
        break;

      case "error":
        console.error("Game error:", message.error);
        break;
    }
  }

  function sendMessage(message: WSMessage) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  function disconnect() {
    if (ws) {
      ws.close();
      ws = null;
    }
    currentGame.value = null;
    isConnected.value = false;
    isHost.value = false;
    connectionStatus.value = "disconnected";
  }

  async function createGame() {
    try {
      const response = await $fetch<{ gameId: string; url: string }>(
        "/api/games/create",
        {
          method: "POST",
        }
      );
      return response;
    } catch (error) {
      console.error("Failed to create game:", error);
      throw error;
    }
  }

  return {
    currentGame: readonly(currentGame),
    isConnected: readonly(isConnected),
    isHost: readonly(isHost),
    connectionStatus: readonly(connectionStatus),
    connect,
    disconnect,
    sendMessage,
    createGame,
  };
});
