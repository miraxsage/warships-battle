<script setup lang="ts">
import ShipSvg1 from "./components/ShipSvg1.vue";
import ShipSvg2 from "./components/ShipSvg2.vue";
import ShipSvg3 from "./components/ShipSvg3.vue";
import ShipSvg4 from "./components/ShipSvg4.vue";
import { useShipDragging } from "./composables/useShipDragging";
import type { ShipProps } from "./types";
import { shipClipPath } from "./utils/helpers";

const ShipsComponents = {
  1: ShipSvg1,
  2: ShipSvg2,
  3: ShipSvg3,
  4: ShipSvg4,
};

const ROTATIONS = { top: 0, right: 90, down: 180, left: 270 };

const ship = defineProps<ShipProps>();

const rotationDegree = ref(0);

watchEffect(() => {
  const newRotation = ROTATIONS[ship.rotation ?? "top"];
  if (newRotation != rotationDegree.value) {
    rotationDegree.value += Math.abs(
      (rotationDegree.value % 360) - (!newRotation ? 360 : newRotation)
    );
  }
});

const el = useTemplateRef<HTMLDivElement>("el");
const { coords, shipCoordination } = useShipDragging(el, {
  shipId: ship.id,
  initial: {
    x: `calc(var(--fcell-size) * ${ship.x})`,
    y: `calc(var(--fcell-size) * ${ship.y})`,
  },
});
</script>
<template>
  <component
    :is="ShipsComponents[type]"
    :class="[$style.ship, $style[`ship${type}`]]"
    theme="error"
    :style="{
      left: coords.x,
      top: coords.y,
      opacity: (shipCoordination?.invalidParts.length ?? 0) > 0 ? 1 : 0,
      clipPath: shipClipPath(ship, shipCoordination?.invalidParts ?? [], true),
      rotate: `${rotationDegree}deg`,
      ...(coords.displaceX || coords.displaceY
        ? { transformOrigin: `${coords.displaceX}px ${coords.displaceY}px` }
        : {}),
    }"
  />
  <component
    :is="ShipsComponents[type]"
    ref="el"
    :class="[$style.ship, $style[`ship${type}`]]"
    :style="{
      left: coords.x,
      top: coords.y,
      clipPath: shipClipPath(ship, shipCoordination?.invalidParts ?? []),
      rotate: `${rotationDegree}deg`,
      ...(coords.displaceX || coords.displaceY
        ? { transformOrigin: `${coords.displaceX}px ${coords.displaceY}px` }
        : {}),
    }"
  />
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
  height: calc(var(--fcell-size) * 4);
}
.ship3 {
  height: calc(var(--fcell-size) * 3);
}
.ship2 {
  height: calc(var(--fcell-size) * 2);
}
.ship1 {
  height: calc(var(--fcell-size) * 1);
}
</style>
