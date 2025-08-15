<style lang="scss" module>
@use "~/styles/colors" as *;
@use "~/styles/mixins" as *;
.players {
  display: flex;
  gap: calc(var(--cell-size) * 0.8);
  align-items: center;
  width: min-content;
  margin: 0 auto;
  justify-content: space-between;
  width: 100%;
}
.vs {
  color: $pen-color;
  width: pxrem(150);
  height: pxrem(150);
}
.container {
  display: flex;
  flex-direction: column;
  gap: calc(var(--cell-size) * 0.85);
  height: 100%;
  justify-content: center;
  align-content: space-between;
  margin: 0 auto;
  width: 700px;
}
.qrcode {
  path {
    fill: $pen-color !important;
  }
  max-width: calc(var(--cell-size) * 5.333);
  max-height: calc(var(--cell-size) * 5.333);
  min-width: calc(var(--cell-size) * 5.333);
  min-height: calc(var(--cell-size) * 5.333);
}
.qrcodeContainer {
  display: flex;
  align-items: center;
  gap: calc(var(--cell-size) * 0.8);
}
.qrcodeText,
.statusText,
.qrcodeLink {
  text-align: center;
  font-size: pxrem(20);
  color: $pen-color;
  text-align: left;
  font-size: pxrem(24);
  filter: drop-shadow(0px 1px 0 $pen-color) drop-shadow(1px 0px 0 $pen-color);
}
.statusText {
  text-align: center;
}
.qrcodeLink {
  display: inline;
  font-size: pxrem(30);
  color: white;
  background-color: $pen-color;
  font-weight: 600;
  user-select: all;
  &::selection {
    background-color: rgb(83, 52, 177) !important;
    color: white !important;
  }
}
.qrcodeTextContainer {
  display: flex;
  flex-direction: column;
  gap: calc(var(--cell-size) * 0.8);
}
.loader {
  display: flex;
  margin-top: calc(var(--cell-size) * 0.666);
  margin-bottom: calc(var(--cell-size) * 0.666);
  width: 400%;
  position: relative;
  animation: loaderPosition 10s infinite cubic-bezier(0.34, 0.48, 0.69, 0.57),
    loaderScale 10s infinite cubic-bezier(0.68, 0.04, 0.28, 0.98);
  & > div {
    height: calc(var(--cell-size) * 0.333);
    width: 50%;
    background-repeat: no-repeat;
    background-image: url("/images/dash-line.svg");
    background-size: 200%;
    background-position: right;
    &:nth-child(2n) {
      scale: -1 1;
      margin-left: -5px;
    }
  }
}
.loaderContainer {
  overflow: hidden;
}
@keyframes loaderPosition {
  0% {
    left: 0;
  }
  50% {
    left: -150%;
  }
  100% {
    left: -300%;
  }
}
@keyframes loaderScale {
  0% {
    scale: 1 1;
  }
  50% {
    scale: 2 1;
  }
  100% {
    scale: 1 1;
  }
}
</style>
<script setup lang="ts">
const userStore = useUserStore();
const gameStore = useGameStore();
const route = useRoute();

const gameUrl = ref<string>("");
const isLoading = ref(false);

async function createNewGame() {
  const { gameId, url } = await gameStore.createGame();
  console.log("createNewGame", gameId, url);
  history.pushState({}, "", url);
  gameUrl.value = url;
  gameStore.connect(gameId);
}

onMounted(async () => {
  gameStore.resetStats();

  const peerGameId = route.query.peer as string; //|| "c7a6652303aa25ac46e7408b80c75ba7";

  if (peerGameId) {
    try {
      isLoading.value = true;
      // Проверяем статус игры перед подключением
      const gameStatus = await gameStore.checkGameStatus(peerGameId);

      console.log("gameStatus", gameStatus);
      if (!gameStatus || gameStatus.isFinished) {
        await createNewGame();
      } else {
        const { url } = gameStore.connect(peerGameId);
        gameUrl.value = url;
      }
    } catch (error) {
      console.error("Failed to check game status or create new game:", error);
      try {
        await createNewGame();
      } catch (createError) {
        console.error("Failed to create game:", createError);
      }
    } finally {
      isLoading.value = false;
    }
  } else {
    try {
      isLoading.value = true;
      const { gameId, url } = await gameStore.createGame();
      history.pushState({}, "", url);
      gameUrl.value = url;
      gameStore.connect(gameId);
    } catch (error) {
      console.error("Failed to create game:", error);
    } finally {
      isLoading.value = false;
    }
  }
});

const statusText = computed(() => {
  if (isLoading.value) return "Создание игры...";
  if (gameStore.gameStatus === "connecting") return "Подключение...";
  if (!gameStore.isConnected) return "Ошибка подключения";
  if (!gameStore.currentGame?.guestUser)
    return "Ожидание подключения соперника...";
  return "Игрок подключился! Игра начинается...";
});

const shouldShowQRCode = computed(
  () => gameStore.isHost && !gameStore.currentGame?.guestUser && gameUrl.value
);

const hostUser = computed(() => {
  const peerGameId = route.query.peer as string;
  return (
    gameStore.currentGame?.hostUser ||
    (!peerGameId && userStore.user) ||
    undefined
  );
});
</script>
<template>
  <div :class="$style.container">
    <div :class="$style.players">
      <UserLegend :user="hostUser" />
      <SpriteSymbol name="vs" :class="$style.vs" />
      <UserLegend :user="gameStore.currentGame?.guestUser" align="right" />
    </div>

    <div v-if="shouldShowQRCode" :class="$style.qrcodeContainer">
      <Qrcode
        :class="$style.qrcode"
        :value="gameUrl"
        variant="rounded"
        :radius="20"
        whiteColor="transparent"
      />
      <div :class="$style.qrcodeTextContainer">
        <div>
          <div :class="$style.qrcodeLink">
            {{ gameUrl }}
          </div>
        </div>
        <div :class="$style.qrcodeText">
          Отправьте данную ссылку вашему другу, чтобы он подключился к игре
        </div>
      </div>
    </div>

    <div :class="$style.loaderContainer">
      <div
        v-if="gameStore.currentGame?.status !== 'arrangement'"
        :class="$style.loader"
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div :class="$style.statusText">{{ statusText }}</div>
    </div>
  </div>
</template>
