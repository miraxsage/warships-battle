<style>
.border1,
.border2 {
  mask-image: url("/images/border1.svg");
  mask-size: 100% 100%;
  background-color: var(--pen-color);
  width: 100%;
  height: 100%;
  scale: 1.1;
  translate: 5px -1px;
  background-repeat: no-repeat;
}
.border2 {
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
  font-size: 38px;
  color: var(--pen-color);
  filter: drop-shadow(1px 0px 0px var(--pen-color))
    drop-shadow(0px 1px 0px var(--pen-color));
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
import type { PlayfieldState } from "./types";
import { fieldStateContextKey } from "./utils";
import { useResizeObserver } from "@vueuse/core";

const { type } = defineProps<{ type: "player" | "enemy" }>();
const hletters = ["A", "Б", "В", "Г", "Д", "E", "Ж", "З", "И", "К"];
const state = reactive<PlayfieldState>({
  fieldCoords: {} as DOMRect,

  ships: [
    { id: "4-ship", type: 4, x: 0, y: 6, rotation: "top" },
    { id: "3-ship-1", type: 3, x: 1, y: 7, rotation: "top" },
    { id: "3-ship-2", type: 3, x: 2, y: 7, rotation: "top" },
    { id: "2-ship-1", type: 2, x: 3, y: 8, rotation: "top" },
    { id: "2-ship-2", type: 2, x: 4, y: 8, rotation: "top" },
    { id: "2-ship-3", type: 2, x: 5, y: 8, rotation: "top" },
    { id: "1-ship-1", type: 1, x: 6, y: 9, rotation: "top" },
    { id: "1-ship-2", type: 1, x: 7, y: 9, rotation: "top" },
    { id: "1-ship-3", type: 1, x: 8, y: 9, rotation: "top" },
    { id: "1-ship-4", type: 1, x: 9, y: 9, rotation: "top" },
  ],
});
provide(fieldStateContextKey, state);

const root = useTemplateRef("root");
const onRearrangeHandler = () => {
  setTimeout(() => {
    if (root.value) {
      state.fieldCoords = root.value.getBoundingClientRect();
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
    <ShipPlaceholder />
    <Ship v-for="props in state.ships" v-bind="props" :key="props.id" />
  </div>
</template>
