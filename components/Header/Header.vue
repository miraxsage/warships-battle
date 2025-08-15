<style lang="scss">
@use "@/styles/mixins" as *;
@use "@/styles/colors" as *;

.header {
  height: calc(var(--fcell-size) * 2);
}
.reset-game {
  position: absolute;
  left: 0;
  top: 0;
}

.game-stats-container {
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  width: calc(var(--fcell-size) * 22.5);
  height: 100%;
  margin: 0 auto;
  position: relative;
}

.game-time-left {
  font-size: pxrem(22);
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: end;
  height: 100%;
  padding-bottom: calc(var(--fcell-size) * 0.4);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  span {
    @include bold-filter;
  }
}
.game-time-left-icon {
  margin-bottom: pxrem(10);
  color: $pen-color;
  @include fixedSize(30px);
  @include xl {
    @include fixedSize(34px);
  }
  @include xxl {
    @include fixedSize(40px);
  }
  @include xxxl {
    @include fixedSize(48px);
  }
}
</style>

<script setup lang="ts">
import { formatTime } from "../Playfield/components/PlayfieldDetails/utils";

const gameStore = useGameStore();
const fieldStore = useFieldStore();
const gameTimeLeft = ref(0);

let timeout: NodeJS.Timeout | null = null;
onMounted(() => {
  timeout = setInterval(() => {
    gameTimeLeft.value = Math.round(
      (Date.now() - (gameStore.gameStartedAt?.getTime() ?? Date.now())) / 1000
    );
  }, 1000);
});

onUnmounted(() => {
  if (timeout) {
    clearInterval(timeout);
  }
});

const showStats = ref(false);
const gameIsStarted = ref(false);

watchEffect(() => {
  if (gameStore.currentGame) {
    console.log(gameStore.gameStatus);
    if (gameStore.gameStatus.match(/(^arrangement$)|(Turn(Finished|Lost)?$)/)) {
      setTimeout(
        () => {
          showStats.value = true;
          gameIsStarted.value = true;
        },
        !gameIsStarted.value ? 1900 : 300
      );
    } else if (
      gameStore.gameStatus.match(
        /(ConnectionRepairingWaiting|Exited|failed|connecting|finished|ArrangementLose|ConnectionWaiting)$/
      )
    ) {
      showStats.value = false;
    } else if (gameIsStarted.value) {
      setTimeout(() => {
        showStats.value = true;
      }, 300);
    }
  } else {
    showStats.value = false;
  }
});

const player = computed(() =>
  gameStore.playerRole === "host"
    ? gameStore.currentGame?.hostUser
    : gameStore.currentGame?.guestUser
);

const enemy = computed(() =>
  gameStore.enemyRole === "host"
    ? gameStore.currentGame?.hostUser
    : gameStore.currentGame?.guestUser
);

function handleResetGame() {
  gameStore.resetGame();
  fieldStore.resetPlayerField();
}
</script>

<template>
  <div class="header container">
    <!-- <button class="reset-game" @click="handleResetGame">reset game</button> -->
    <Transition name="fade">
      <div class="game-stats-container" v-if="showStats">
        <UserLegend :user="player">
          <template #actions>
            <UserGameStats user="player" />
          </template>
        </UserLegend>
        <div />
        <UserLegend :user="enemy" align="right">
          <template #actions>
            <UserGameStats user="enemy" align="right" />
          </template>
        </UserLegend>
        <div class="game-time-left">
          <SpriteSymbol name="game/clock" class="game-time-left-icon" />
          <span> {{ formatTime(gameTimeLeft) }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
