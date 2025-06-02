<script setup lang="ts">
import { ROTATION_ANGLE } from "~/constants/common";
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

const { id } = defineProps<ShipProps>();
const ship = useShip(id)!;

const rotationDegree = ref(0);
watchEffect(() => {
  const newRotation = ROTATION_ANGLE[ship.rotation];
  const oldRotation = rotationDegree.value % 360;
  if (newRotation != oldRotation) {
    const cwAngle = (360 + newRotation - oldRotation) % 360;
    const ccwAngle = (newRotation - oldRotation - 360) % 360;
    const angle = Math.abs(cwAngle) > Math.abs(ccwAngle) ? ccwAngle : cwAngle;
    rotationDegree.value += angle;
  }
});

const el = useTemplateRef<HTMLDivElement>("el");
const { coords, shipCoordination } = useShipDragging(el, ship.id);
</script>
<template>
  <component
    :is="ShipsComponents[ship.type]"
    :class="['ship', `ship${ship.type}`]"
    theme="error"
    :style="{
      left: coords.x,
      top: coords.y,
      zIndex: ship.isDragging ? 100 : 1,
      opacity: (shipCoordination?.invalidParts.length ?? 0) > 0 ? 1 : 0,
      clipPath: shipClipPath(ship, shipCoordination?.invalidParts ?? [], true),
      rotate: `${rotationDegree}deg`,
      ...(coords.displaceX || coords.displaceY
        ? { transformOrigin: `${coords.displaceX}px ${coords.displaceY}px` }
        : {}),
    }"
  />
  <component
    :is="ShipsComponents[ship.type]"
    ref="el"
    :class="['ship', `ship${ship.type}`, { smooth: ship.isSmooth }]"
    :style="{
      zIndex: ship.isDragging ? 100 : 1,
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
<style lang="scss">
.smooth.smooth {
  transition: all 0.5s;
}
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
