<style lang="scss">
@use "@/styles/mixins.scss" as *;
@use "~/styles/colors.scss" as *;

.border1,
.border2 {
  width: 100%;
  height: 100%;
}
.field-disabled {
  pointer-events: none;
}
.border1:before,
.border2:before {
  content: "";
  display: block;
  position: absolute;
  mask-image: url("/images/border1.svg");
  mask-size: 100% 100%;
  background-color: var(--pen-color);
  width: 100%;
  height: 100%;
  scale: 1.1;
  translate: 5px -1px;
  background-repeat: no-repeat;
}
.border2:before {
  mask-image: url("/images/border2.svg");
  mask-size: 100% 100%;
  background-color: var(--pen-color);
  translate: 0px 2px;
  scale: -1.09 -1.09;
}

:is(.border1, .border2):has(> .critical:first-of-type):before {
  background-color: $error;
  mix-blend-mode: multiply;
}
:is(.border1, .border2):has(> .successful:first-of-type):before {
  background-color: #959595;
  mix-blend-mode: multiply;
}

.v-ruler,
.h-ruler {
  position: absolute;
  top: calc(-2.3 * var(--cell-size));
  width: 100%;
  height: calc(var(--fcell-size));
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: center;
  justify-items: center;
  font-family: "First Time Writing";
  color: var(--pen-color);
  @include bold-filter;

  font-size: pxrem(38);
}
.v-ruler {
  width: var(--fcell-size);
  height: 100%;
  top: 0;
  left: calc(-1 * var(--fcell-size) - 5px);
  grid-template-columns: 1fr;
  grid-template-rows: repeat(10, 1fr);
}
</style>
<script setup lang="ts">
import Pelengator from "./Pelengator/Pelengator.vue";
import { Ship, ShipPlaceholder, PlayboardCellState } from ".";

defineOptions({
  inheritAttrs: false,
});

const { type } = defineProps<{ type: "player" | "enemy" }>();

const isPlayerField = type == "player";
const isEnemyField = type == "enemy";

const hletters = ["A", "Б", "В", "Г", "Д", "E", "Ж", "З", "И", "К"];

const root = useTemplateRef("root");
const game = useGameStore();
const boardIsDisabled = computed(() => {
  console.log("playfieldBoard", type, isPlayerField, game.gameStatus);
  return (
    isPlayerField &&
    game.gameStatus != "arrangement" &&
    game.gameStatus != `${game.playerRole}ArrangementWaiting`
  );
});

const hitIsSent = ref(false);
const isPelengatorDisabled = computed(() => {
  return hitIsSent.value;
});

const handlePelengatorHit = (coords: { x: number; y: number }) => {
  if (hitIsSent.value) return;
  hitIsSent.value = true;
  game.sendMessage({
    type: "game:turn",
    data: { x: coords.x, y: coords.y },
  });
};

const { fieldState } = usePlayfield(root, type);
const turnsMap = computed(() => {
  if (isPlayerField) {
    return fieldState.enemy.turnsMap;
  }
  return fieldState.player.turnsMap;
});
</script>
<template>
  <div
    class="playfield"
    v-bind="$attrs"
    ref="root"
    :class="{
      'field-disabled':
        (isPlayerField && boardIsDisabled) ||
        (isEnemyField && isPelengatorDisabled),
    }"
  >
    <div :class="type == 'player' ? 'border1' : 'border2'" />
    <div class="h-ruler">
      <div v-for="letter in hletters">
        {{ letter }}
      </div>
    </div>
    <div class="v-ruler">
      <div v-for="digit in 10">
        {{ digit }}
      </div>
    </div>
    <ShipPlaceholder v-if="isPlayerField" />
    <Ship
      :key="props.id"
      v-for="props in fieldState[type].ships"
      v-bind="props"
      :owner="type"
    />
    <template v-for="col in 10" :key="`${type}-${col}-states`">
      <template v-for="row in 10" :key="`${type}-${col}-${row}-state`">
        <PlayboardCellState
          v-if="turnsMap[col - 1]?.[row - 1]?.count"
          :x="col - 1"
          :y="row - 1"
          :owner="type"
        />
      </template>
    </template>
    <template v-if="isEnemyField">
      <Pelengator @hit="handlePelengatorHit" :hitIsSent="hitIsSent" />
    </template>
  </div>
</template>
