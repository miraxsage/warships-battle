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
</style>
<script setup lang="ts">
const gameStore = useGameStore();
const isOnlyPlayerMessage = computed(() => {
  const player = gameStore.isHost ? "host" : "guest";
  const enemy = gameStore.isHost ? "guest" : "host";
  return (
    gameStore.currentGame &&
    [
      `${enemy}ConnectionRepairingWaiting`,
      `${enemy}Exited`,
      `${enemy}TurnLost`,
      `${player}TurnLost`,
      "arrangementFinished",
      "finished",
    ].includes(gameStore.gameStatus)
  );
});
</script>
<template>
  <div>
    <TransitionGroup name="fade" mode="out-in">
      <Playfield
        key="player"
        type="player"
        :class="['player-field', isOnlyPlayerMessage && 'only-player-message']"
      />
      <Playfield
        key="enemy"
        type="enemy"
        v-if="!isOnlyPlayerMessage"
        class="enemy-field"
      />
    </TransitionGroup>
  </div>
</template>
