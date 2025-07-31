<style>
.header {
  height: calc(var(--fcell-size) * 2);
}
</style>
<template>
  <div class="header">
    <button @click="handleResetGame">reset game</button>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();
const fieldStore = useFieldStore();

function handleResetGame() {
  gameStore.resetGame();
  fieldStore.resetPlayerField();
}
</script>
