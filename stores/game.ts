import type {
  Game,
  GameStatus,
  WSMessage,
  WSGameJoinedData,
  WSGameUpdateData,
  WSGameLeftData,
  WSGameResetData,
} from "~/types/game";
import * as _ from "lodash-es";

export const useGameStore = defineStore("game", () => {
  const currentGame = ref<Game | null>(null);
  const isConnected = ref(false);
  const isHost = ref(false);
  const playerRole = computed(() => (isHost.value ? "host" : "guest"));
  const enemyRole = computed(() => (!isHost.value ? "host" : "guest"));
  const gameStatus = ref<GameStatus>("initial");
  const turnNumber = computed(() => currentGame.value?.turnNumber || 0);
  const lastTurn = computed(() => currentGame.value?.lastTurn || null);
  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  const userStore = useUserStore();
  const fieldStore = useFieldStore();

  function connect(gameId: string) {
    const game = {
      gameId,
      url: String(new URL(`/game?peer=${gameId}`, location.origin)),
    };

    if (ws?.readyState === WebSocket.OPEN) {
      return game;
    }

    gameStatus.value = "connecting";

    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${location.host}/_ws`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      isConnected.value = true;
      gameStatus.value = "joining";
      reconnectAttempts = 0;

      // Присоединяемся к игре
      sendMessage({
        type: "game:join",
        data: {
          gameId,
          userId: userStore.user!.id,
          username: userStore.user!.username,
          avatar: userStore.user!.avatar,
        },
      });
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        gameStatus.value = "failed";
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      gameStatus.value = "failed";
      isConnected.value = false;

      // Автоматическое переподключение
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setTimeout(() => connect(gameId), 1000 * reconnectAttempts);
      }
    };

    ws.onerror = (error) => {
      gameStatus.value = "failed";
      isConnected.value = false;
      console.error("WebSocket error:", error);
    };

    return game;
  }

  function handleMessage(message: WSMessage) {
    console.log("WebSocket message received:", message);

    switch (message.type) {
      case "game:joined":
        {
          const data = message.data;
          gameStatus.value = message.data.status || "failed";
          if (data) {
            console.log("Game joined:", data);
            console.log("Host user:", data.game?.hostUser);
            console.log("Guest user:", data.game?.guestUser);
            currentGame.value = data.game;
            isHost.value = data.isHost;
          }
        }
        break;

      case "game:update":
        {
          const data = message.data;
          gameStatus.value = data.status || gameStatus.value;
          if (data?.game) {
            console.log("Game updated:", data.game);
            console.log("Updated Host user:", data.game?.hostUser);
            console.log("Updated Guest user:", data.game?.guestUser);
            _.merge(currentGame.value, data.game);
          }
        }
        break;

      case "game:turned":
        {
          const data = message.data;
          if (data) {
            console.log(
              `${data.status.replace("TurnFinished", "")} turned:`,
              data.x,
              data.y,
              data.turn,
              data.turnsMap
            );
            gameStatus.value = data.status || gameStatus.value;
            const role = data.status
              .replace("TurnFinished", "")
              .toLowerCase() as "host" | "guest";
            const performer = role == playerRole.value ? "player" : "enemy";
            const lastTurn = {
              role,
              performer,
              x: data.x,
              y: data.y,
              result: data.turn?.type || "miss",
            } as const;
            currentGame.value!.lastTurn = lastTurn;
            if (lastTurn.performer == "player" && data.turnsMap) {
              fieldStore.player.turnsMap = data.turnsMap;
            } else if (lastTurn.performer == "enemy" && data.turnsMap) {
              fieldStore.enemy.turnsMap = data.turnsMap;
            }
          }
        }
        break;

      case "game:left":
        {
          const data = message.data;
          if (data) {
            console.log("Player left:", data.userId);
          }
        }
        break;

      case "error":
        console.error("Game error:", message.error);
        break;
    }
    currentGame.value!.status = gameStatus.value;
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
    gameStatus.value = isHost.value ? "hostExited" : "guestExited";
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

  function resetGame() {
    if (currentGame.value) {
      sendMessage({
        type: "game:reset",
        data: {
          gameId: currentGame.value.id,
        },
      });
    }
  }

  return {
    currentGame: readonly(currentGame),
    isConnected: readonly(isConnected),
    isHost: readonly(isHost),
    playerRole,
    enemyRole,
    gameStatus: readonly(gameStatus),
    turnNumber: readonly(turnNumber),
    lastTurn: readonly(lastTurn),
    connect,
    disconnect,
    sendMessage,
    createGame,
    resetGame,
    setGameStatus: (status: GameStatus) => {
      gameStatus.value = status;
    },
    setLastTurn: (turn: Game["lastTurn"]) => {
      currentGame.value!.lastTurn = turn;
      if (turn?.performer == "player") {
        if (!fieldStore.player.turnsMap[turn.x]) {
          fieldStore.player.turnsMap[turn.x] = [];
        }
        fieldStore.player.turnsMap[turn.x]![turn.y] = {
          type: turn.result,
          count: 1,
        };
      }
    },
    clearTurnsMap: () => {
      fieldStore.player.turnsMap = [];
      fieldStore.enemy.turnsMap = [];
    },
  };
});
