<style lang="scss" module>
@use "~/styles/colors" as *;
@use "~/styles/mixins" as *;
.players {
  display: flex;
  gap: 20px;
  align-items: center;
  width: min-content;
  margin: 0 auto;
  justify-content: space-between;
  width: 100%;
}
.vs {
  color: $pen-color;
  width: 150px;
  height: 150px;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 25px;
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
  max-width: 160px;
  max-height: 160px;
  min-width: 160px;
  min-height: 160px;
}
.qrcodeContainer {
  display: flex;
  align-items: center;
  gap: 20px;
}
.qrcodeText,
.statusText,
.qrcodeLink {
  text-align: center;
  font-size: 20px;
  color: $pen-color;
  text-align: left;
  font-size: 24px;
  filter: drop-shadow(0px 1px 0 $pen-color) drop-shadow(1px 0px 0 $pen-color);
}
.statusText {
  text-align: center;
}
.qrcodeLink {
  display: inline;
  font-size: 30px;
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
  gap: 15px;
}
.loader {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 400%;
  position: relative;
  animation: loaderPosition 10s infinite cubic-bezier(0.34, 0.48, 0.69, 0.57),
    loaderScale 10s infinite cubic-bezier(0.68, 0.04, 0.28, 0.98);
  & > div {
    height: 10px;
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

onMounted(async () => {
  const peerGameId =
    (route.query.peer as string) || "c7a6652303aa25ac46e7408b80c75ba7";

  if (peerGameId) {
    const { url } = gameStore.connect(peerGameId);
    gameUrl.value = url;
  } else {
    try {
      isLoading.value = true;
      const { gameId, url } = await gameStore.createGame();
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
      <UserLegend
        :user="gameStore.currentGame?.guestUser"
        arrangement="right"
      />
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
