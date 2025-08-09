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
    transform: scale(2, 1.8) translate(0%, 4%);
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
@keyframes fadeOut {
  0% {
    opacity: 1;
    filter: blur(0px);
    transform: scale(2, 1.8) translate(0%, 4%);
  }
  100% {
    opacity: 0;
    filter: blur(5px);
    transform: scale(3, 3) translate(0%, 4%);
  }
}
.missImage {
  width: 100%;
  height: 100%;
  transform: scale(2.5) translate(3%, 30%);
  &.fadeIn {
    animation: missAnimation calc(var(--turn-animation-duration) * 0.6) forwards;
  }
}
.hitImage,
.hitFlame {
  opacity: 0;
  width: 100%;
  height: 100%;
  transform: scale(2, 1.8) translate(0%, 0%);
  &:not(.hitDelayed) {
    opacity: 1;
    transform: scale(2, 1.8) translate(0%, 4%);
  }
  &.hitDelayed {
    animation: hitAnimation calc(var(--turn-animation-duration) * 0.4)
      cubic-bezier(0, 0.59, 0.42, 1.01) 1s forwards;
  }
  &.fadeOut {
    animation: fadeOut 15s forwards;
  }
  &.hidden {
    opacity: 0;
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
  pointer-events: none;
  z-index: 1;
  top: calc(var(--fcell-size) * var(--y));
  left: calc(var(--fcell-size) * var(--x));
  width: var(--fcell-size);
  height: var(--fcell-size);
  &:has(.hitFlame) {
    z-index: 2;
  }
  &:has(.hitImage) {
    z-index: 3;
  }
}
</style>
<script setup lang="ts">
import { TURN_ANIMATION_DURATION } from "~/constants/common";

const props = defineProps<{
  x: number;
  y: number;
  owner: "player" | "enemy";
}>();
const fieldState = useFieldStore();
const gameStore = useGameStore();
const counterOwner = computed(() =>
  props.owner == "player" ? "enemy" : "player"
);
const cellState = computed(() => {
  if (counterOwner.value == "player") {
    return fieldState.player.turnsMap[props.x]?.[props.y]?.type ?? "empty";
  }
  return fieldState.enemy.turnsMap[props.x]?.[props.y]?.type ?? "empty";
});
const isLastTurnCellState = computed(() => {
  const lastTurn = gameStore.currentGame?.lastTurn;
  return (
    lastTurn?.performer == counterOwner.value &&
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
    }, (status == "miss" ? 1.15 : 1.05) * TURN_ANIMATION_DURATION);
  }
});

const fadeOut = ref(false);
const hidden = ref(false);

watchEffect(() => {
  const cellField =
    props.owner == "player" ? fieldState.player : fieldState.enemy;
  const cellTurnsMap =
    counterOwner.value == "player"
      ? fieldState.player.turnsMap
      : fieldState.enemy.turnsMap;
  const cellState = cellTurnsMap[props.x]?.[props.y];
  if (!cellState || cellState.type != "hit") {
    return;
  }
  let actualShipState = "normal";
  let damagedParts: number[] = [];
  const ship = cellField.ships.find((ship) =>
    someShipPart(ship, ({ x, y }) => x == props.x && y == props.y)
  );
  if (!ship) {
    return;
  }
  let isLastTurnDamagedShip = false;
  forEachShipPart(ship, ({ part, x, y }) => {
    if (!!cellTurnsMap[x]?.[y]?.count) {
      damagedParts.push(part);
      if (gameStore.lastTurn?.x == x && gameStore.lastTurn?.y == y) {
        isLastTurnDamagedShip = true;
      }
    }
  });
  if (damagedParts.length == ship.type) {
    actualShipState = "destroyed";
  } else {
    actualShipState = "damaged";
  }
  if (actualShipState == "destroyed") {
    if (isLastTurnDamagedShip) {
      setTimeout(() => {
        fadeOut.value = true;
      }, TURN_ANIMATION_DURATION * 1.6);
    } else {
      hidden.value = true;
    }
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
      :class="[
        $style.hitImage,
        {
          [$style.hitDelayed]: isLastTurnCellState,
          [$style.fadeOut]: fadeOut,
          [$style.hidden]: hidden,
        },
      ]"
    />
    <img
      v-if="cellState == 'miss' && isShown"
      :src="`/images/missile-miss${isLastTurnCellState ? '-starter' : ''}.svg`"
      alt="miss"
      :class="[$style.missImage, { [$style.fadeIn]: isLastTurnCellState }]"
    />
  </div>
</template>
