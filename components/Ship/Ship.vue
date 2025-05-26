<script setup lang="ts">
import { useShipDragging } from "./composables";
import type { ShipProps } from "./types";

const ROTATIONS = { top: 0, right: 90, down: 180, left: 270 };

const { x, y, rotation, id } = defineProps<ShipProps>();

const rotationDegree = ref(0);

watchEffect(() => {
  const newRotation = ROTATIONS[rotation ?? "top"];
  if (newRotation != rotationDegree.value) {
    rotationDegree.value += Math.abs(
      (rotationDegree.value % 360) - (!newRotation ? 360 : newRotation)
    );
  }
});

const el = useTemplateRef<HTMLDivElement>("el");
const coords = useShipDragging(el, {
  shipId: id,
  initial: {
    x: `calc(var(--fcell-size) * ${x})`,
    y: `calc(var(--fcell-size) * ${y})`,
  },
});
</script>
<template>
  <div
    ref="el"
    :class="[$style.ship, $style[`ship${type}`]]"
    :style="{
      left: coords.x,
      top: coords.y,
      rotate: `${rotationDegree}deg`,
      ...(coords.displaceX || coords.displaceY
        ? { transformOrigin: `${coords.displaceX}px ${coords.displaceY}px` }
        : {}),
    }"
  ></div>
</template>
<style module lang="scss">
.ship {
  background-size: 100% 100%;
  width: calc(var(--fcell-size));
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  mix-blend-mode: multiply;
  transform-origin: calc(var(--fcell-size) / 2) calc(var(--fcell-size) / 2);
  transition: rotate 0.5s;
}
.ship4 {
  background-image: url("./images/ship4.svg");
  height: calc(var(--fcell-size) * 4);
  // scale: 1.1 1.01;
  // translate: 0 1px;
}
.ship3 {
  background-image: url("./images/ship3.svg");
  height: calc(var(--fcell-size) * 3);
  // scale: 1.1 1.12;
  // translate: 0 1px;
}
.ship2 {
  background-image: url("./images/ship2.svg");
  height: calc(var(--fcell-size) * 2);
  // scale: 1.1 1.03;
  // translate: 1px 3px;
}
.ship1 {
  background-image: url("./images/ship1.svg");
  height: calc(var(--fcell-size) * 1);
  // scale: 1.17 1.1;
  // translate: 1px 3px;
}
</style>
