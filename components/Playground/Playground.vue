<style lang="scss">
.player-field,
.enemy-field {
  position: absolute;
  width: calc(var(--fcell-size) * 10);
  height: calc(var(--fcell-size) * 10);
  top: calc(
    var(--cell-size) * max(10, (var(--v-cells) - var(--v-cells-odd) - 20) / 2) -
      3px
  );
  left: calc(
    max(
        var(--cell-size),
        var(--horizontal-center) - var(--fcell-size) * 5 - var(--cell-size)
      ) - 1px
  );
  @media (width < 1024px) {
    top: calc(var(--cell-size) * 7 - 3px);
  }
}
.player-field {
  &.only-player-message {
    left: calc(
      max(
          var(--cell-size),
          var(--horizontal-center) - var(--fcell-size) * 5 - var(--cell-size)
        ) - 1px
    );
  }
  @media (width >= 1024px) {
    left: calc(
      max(
          var(--cell-size),
          var(--horizontal-center) - var(--fcell-size) * 11 - var(--cell-size)
        ) - 1px
    );
  }
}
.enemy-field {
  @media (width >= 1024px) {
    left: calc(
      max(
          var(--cell-size),
          var(--horizontal-center) + var(--fcell-size) - var(--cell-size)
        ) - 1px
    );
  }
  @media (width < 1024px) {
    top: calc(var(--cell-size) * 9 + var(--fcell-size) * 11);
  }
}

.fadePlayfield-enter-active,
.fadePlayfield-leave-active {
  transition: color 0.3s;
  &:after,
  & > * {
    transition: opacity 0.3s;
  }
}

.fadePlayfield-enter-from,
.fadePlayfield-leave-to {
  color: white;
  &:after,
  & > * {
    opacity: 0 !important;
  }
}
</style>
<script setup lang="ts">
import DamageVariants from "./DamageVariants.vue";

const gameStore = useGameStore();
const isOnlyPlayerMessage = computed(() => {
  const player = gameStore.isHost ? "host" : "guest";
  const enemy = gameStore.isHost ? "guest" : "host";
  const res =
    (gameStore.currentGame &&
      [
        `${enemy}ConnectionRepairingWaiting`,
        `${enemy}TurnLost`,
        `${player}TurnLost`,
        `${enemy}ArrangementLose`,
        `${player}ArrangementLose`,
        "arrangementFinished",
        "finished",
      ].includes(gameStore.gameStatus)) ||
    !!gameStore.gameStatus.match(/(host|guest)Exited$/);
  console.log("isOnlyPlayerMessage", res, gameStore.gameStatus);
  return res;
});
const isMissileLaunch = computed(() => {
  return (
    gameStore.gameStatus === "guestTurnFinished" ||
    gameStore.gameStatus === "hostTurnFinished"
  );
});
</script>
<template>
  <div>
    <DamageVariants />
    <Playfield
      key="player"
      type="player"
      :class="['player-field', isOnlyPlayerMessage && 'only-player-message']"
      :isOnlyPlayerMessage="!!isOnlyPlayerMessage"
    />
    <Playfield
      key="enemy"
      type="enemy"
      class="enemy-field"
      :isOnlyPlayerMessage="!!isOnlyPlayerMessage"
    />
    <MissileLaunch v-if="isMissileLaunch" />
  </div>
</template>
