<style>
.header {
  height: calc(var(--fcell-size) * 2);
}
</style>
<template>
  <button @click="handleResetGame">reset game</button>
</template>

<script setup lang="ts">
const gameStore = useGameStore();
const fieldStore = useFieldStore();

function handleResetGame() {
  gameStore.resetGame();
  fieldStore.resetPlayerField();
}
</script>
