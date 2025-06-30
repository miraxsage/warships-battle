<style lang="scss">
@use "@/styles/mixins.scss" as *;

.border1,
.border2 {
  width: 100%;
  height: 100%;
}
.border1:before,
.border2:before {
  content: "";
  display: block;
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
import * as _ from "lodash-es";
import { useResizeObserver } from "@vueuse/core";

const { type } = defineProps<{ type: "player" | "enemy" }>();
const isPlayerField = type == "player";
const isEnemyField = type == "enemy";

const hletters = ["A", "Б", "В", "Г", "Д", "E", "Ж", "З", "И", "К"];

const fieldState = useFieldStore();

const root = useTemplateRef("root");

const onRearrangeHandler = () => {
  setTimeout(() => {
    if (root.value) {
      fieldState[type].fieldCoords = root.value.getBoundingClientRect();
    }
  });
};
onMounted(() => {
  window.addEventListener("resize", onRearrangeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", onRearrangeHandler);
});
useResizeObserver(root, onRearrangeHandler);
</script>
<template>
  <div class="playfield" ref="root">
    <div :class="type == 'player' ? 'border1' : 'border2'"></div>
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
