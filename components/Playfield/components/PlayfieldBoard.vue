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

:is(.border1, .border2):has(> .critical):before {
  background-color: $error;
  mix-blend-mode: multiply;
}
:is(.border1, .border2):has(> .successful):before {
  background-color: #959595;
  mix-blend-mode: multiply;
}
:is(.border1, .border2):has(> :is(.critical, .successful)):after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: unset;
  box-shadow: inset 0 0 145px 34px rgb(202 41 41 / 91%);
  border-radius: 20px;
  mix-blend-mode: overlay;
  scale: 1.1;
  translate: 5px -1px;
  pointer-events: none;
}
.border2:has(> .critical):after {
  translate: 0px 2px;
}
:is(.border1, .border2):has(> .successful):after {
  background-color: unset;
  box-shadow: inset 0 0 145px 20px #008142;
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

  font-size: 22px;
  @include sm {
    font-size: 27px;
  }
  @include xl {
    font-size: 32px;
  }
  @include xxxl {
    font-size: 38px;
  }
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
  const player = game.isHost ? "host" : "guest";
  return (
    isPlayerField &&
    game.gameStatus != "arrangement" &&
    game.gameStatus != `${player}ArrangementWaiting`
  );
});

const { fieldState } = usePlayfield(root, type);
</script>
<template>
  <div
    class="playfield"
    v-bind="$attrs"
    ref="root"
    :class="{ 'field-disabled': boardIsDisabled }"
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
    <template v-if="isPlayerField">
      <ShipPlaceholder />
      <Ship
        v-for="props in fieldState.player.ships"
        v-bind="props"
        :key="props.id"
      />
    </template>
    <template v-if="isEnemyField">
      <Pelengator />
    </template>
  </div>
</template>
