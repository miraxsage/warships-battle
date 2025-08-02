<style lang="scss" module>
@keyframes hitFlameAnimation {
  10% {
    opacity: 0;
    filter: blur(1px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    filter: blur(2px);
  }
}
@keyframes hitFlameSizeAnimation {
  0% {
    transform: scale(0, 0) translate(0%, 45%);
  }
  100% {
    transform: scale(8, 8) translate(0%, -50%);
  }
}
@keyframes hitAnimation {
  0% {
    opacity: 0;
    transform: scale(0, 0) translate(0%, 41%);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: scale(2, 1.8) translate(0%, 7%);
    filter: blur(0px);
  }
}
@keyframes missAnimation {
  0% {
    opacity: 0;
    transform: scale(2.5) translate(3%, 15%);
  }
  100% {
    opacity: 1;
    transform: scale(2.5) translate(3%, 30%);
  }
}
.missImage {
  width: 100%;
  height: 100%;
  transform: scale(2.5) translate(3%, 30%);
  animation: missAnimation calc(var(--turn-animation-duration) * 0.6) forwards;
}
.hitImage,
.hitFlame {
  opacity: 0;
  width: 100%;
  height: 100%;
  transform: scale(2, 1.8) translate(0%, 0%);
  animation: hitAnimation calc(var(--turn-animation-duration) * 0.6)
    cubic-bezier(0, 0.59, 0.42, 1.01) forwards;
  &.hitDelayed {
    animation: hitAnimation calc(var(--turn-animation-duration) * 0.6)
      cubic-bezier(0, 0.59, 0.42, 1.01) 1s forwards;
  }
}
.hitFlame {
  position: absolute;
  top: 0;
  left: 0;
  animation: hitFlameAnimation calc(var(--turn-animation-duration) * 0.6)
      forwards,
    hitFlameSizeAnimation var(--turn-animation-duration)
      cubic-bezier(0, 0.37, 0.66, 0.99) forwards;
}
.cellState {
  position: absolute;
  top: calc(var(--fcell-size) * var(--y));
  left: calc(var(--fcell-size) * var(--x));
  width: var(--fcell-size);
  height: var(--fcell-size);
}
</style>
<script setup lang="ts">
import { TURN_ANIMATION_DURATION } from "~/constants/common";

const props = defineProps<{
  x: number;
  y: number;
  holder: "player" | "enemy";
}>();
const fieldState = useFieldStore();
const gameStore = useGameStore();
const cellState = computed(() => {
  if (props.holder == "player") {
    return fieldState.player.turnsMap[props.x]?.[props.y]?.type ?? "empty";
  }
  return fieldState.enemy.turnsMap[props.x]?.[props.y]?.type ?? "empty";
});
const isLastTurnCellState = computed(() => {
  const lastTurn = gameStore.currentGame?.lastTurn;
  return (
    lastTurn?.performer == props.holder &&
    lastTurn?.x == props.x &&
    lastTurn?.y == props.y
  );
});
const isShown = ref(!isLastTurnCellState.value);
onMounted(() => {
  if (isLastTurnCellState.value) {
    const status = gameStore.lastTurn?.result;
    setTimeout(() => {
      isShown.value = true;
    }, (status == "miss" ? 1.15 : 0.95) * TURN_ANIMATION_DURATION);
  }
});
</script>
<template>
  <div :class="$style.cellState" :style="`--x: ${x}; --y: ${y}`">
    <img
      v-if="cellState == 'hit' && isShown && isLastTurnCellState"
      src="/images/fire.svg"
      alt="hit"
      :class="[$style.hitImage, { [$style.hitFlame]: isLastTurnCellState }]"
    />
    <img
      v-if="cellState == 'hit' && isShown"
      src="/images/fire.svg"
      alt="hit"
      :class="[$style.hitImage, { [$style.hitDelayed]: isLastTurnCellState }]"
    />
    <img
      v-if="cellState == 'miss' && isShown"
      src="/images/missile-miss.svg"
      alt="miss"
      :class="$style.missImage"
    />
  </div>
</template>
