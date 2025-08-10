import type {
  Game,
  GameStatus,
  WSMessage,
  WSGameJoinedData,
  WSGameUpdateData,
  WSGameLeftData,
  WSGameResetData,
  WSGameRestoreData,
  ShipState,
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
            if (currentGame.value) {
              currentGame.value.lastTurn = undefined;
            }
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
            console.log("lastTurn", lastTurn);
            currentGame.value!.lastTurn = lastTurn;
            if (lastTurn.performer == "player" && data.turnsMap) {
              fieldStore.player.turnsMap = structuredClone(data.turnsMap);
              console.log("has set player turnsMap", data.turnsMap);
              // Игрок уничтожил вражеский корабль - получаем информацию о нем
              if (data.destroyedShip) {
                const ship = data.destroyedShip;
                let id = `${ship.type}-ship`;
                if (ship.type < 4) {
                  id += `-${
                    _.filter(fieldStore.enemy.ships, { type: ship.type })
                      .length + 1
                  }`;
                }
                const enemyDestroyedShip: ShipStateDetailed = {
                  id,
                  ...data.destroyedShip,
                };
                fieldStore.enemy.ships.push(enemyDestroyedShip);
                console.log(
                  "Enemy ships after push:",
                  fieldStore.enemy.ships.length,
                  fieldStore.enemy.ships
                );
                currentGame.value!.lastTurn!.isShipDestroyed = true;
              }
            } else if (lastTurn.performer == "enemy" && data.turnsMap) {
              if (data.destroyedShip) {
                currentGame.value!.lastTurn!.isShipDestroyed = true;
              }
              fieldStore.enemy.turnsMap = structuredClone(data.turnsMap);
              console.log("has set enemy turnsMap", data.turnsMap);
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

      case "game:restore":
        {
          const data = message.data;
          if (data) {
            console.log("Restoring game state:", data);

            // Восстанавливаем корабли игрока
            if (data.playerArrangement) {
              const shipCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
              fieldStore.player.ships = data.playerArrangement.map((ship) => {
                shipCounts[ship.type]++;
                const id =
                  ship.type === 4
                    ? "4-ship"
                    : `${ship.type}-ship-${shipCounts[ship.type]}`;
                return {
                  id,
                  ...ship,
                };
              });
            }

            // Восстанавливаем карту ходов игрока
            if (data.playerTurnsMap) {
              fieldStore.player.turnsMap = structuredClone(data.playerTurnsMap);
            }

            // Восстанавливаем карту ходов противника (только видимые ходы)
            if (data.enemyTurnsMap) {
              fieldStore.enemy.turnsMap = structuredClone(data.enemyTurnsMap);
            }

            // Восстанавливаем информацию об уничтоженных кораблях противника
            if (data.enemyArrangement) {
              fieldStore.enemy.ships = data.enemyArrangement.map(
                (ship, index) => {
                  const shipCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
                  data.enemyArrangement
                    .slice(0, index)
                    .forEach((s) => shipCounts[s.type]++);
                  shipCounts[ship.type]++;

                  const id =
                    ship.type === 4
                      ? "4-ship"
                      : `${ship.type}-ship-${shipCounts[ship.type]}`;
                  return {
                    id,
                    ...ship,
                  };
                }
              );
            }

            // Восстанавливаем номер хода
            if (data.turnNumber && currentGame.value) {
              currentGame.value.turnNumber = data.turnNumber;
            }
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
  };
});
