<script setup lang="ts">
import * as _ from "lodash-es";
import { ROTATION_ANGLE } from "~/constants/common";
import ShipSvg1 from "./components/ShipSvg1.vue";
import ShipSvg2 from "./components/ShipSvg2.vue";
import ShipSvg3 from "./components/ShipSvg3.vue";
import ShipSvg4 from "./components/ShipSvg4.vue";
import { useShipDragging } from "./composables/useShipDragging";
import type { ShipProps } from "./types";
import { shipMaskImage } from "./utils/helpers";

const ShipsComponents = {
  1: ShipSvg1,
  2: ShipSvg2,
  3: ShipSvg3,
  4: ShipSvg4,
};

const { id, owner } = defineProps<ShipProps>();
const { ship, damagedParts, isDestroyed, isDamaged, isLastTurnDamaged } =
  useShip(id, owner)!;

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
const { coords, shipCoordination } = useShipDragging(el, ship.id, owner);

const invalidParts = computed(() => {
  return _.isEmpty(shipCoordination?.invalidParts)
    ? damagedParts.value
    : shipCoordination?.invalidParts;
});

const subTheme = computed(() => {
  return isDestroyed.value ? "destroyed" : isDamaged.value ? "fire" : "error";
});
const theme = computed(() => {
  return isDestroyed.value ? "fire" : "normal";
});
</script>
<template>
  <component
    :is="ShipsComponents[ship.type]"
    :class="[
      'ship',
      `ship${ship.type}`,
      `subShip`,
      `${subTheme}Theme`,
      owner == 'enemy' ? 'enemyOwned' : 'playerOwned',
      { hidden: _.isEmpty(invalidParts), fadeIn: isLastTurnDamaged },
    ]"
    :theme="subTheme"
    :key="subTheme"
    :style="{
      left: coords.x,
      top: coords.y,
      zIndex: ship.isDragging ? 100 : 1,
      maskImage: isDestroyed
        ? 'unset'
        : shipMaskImage(ship, invalidParts, true, isDamaged ? 75 : 20),
      rotate: `${rotationDegree}deg`,
      ...(coords.displaceX || coords.displaceY
        ? { transformOrigin: `${coords.displaceX}px ${coords.displaceY}px` }
        : {}),
    }"
  />
  <component
    :is="ShipsComponents[ship.type]"
    ref="el"
    :theme="theme"
    :key="theme"
    :class="[
      'ship',
      `ship${ship.type}`,
      `mainShip`,
      `${theme}Theme`,
      owner == 'player' ? 'playerOwned' : 'enemyOwned',
      { smooth: ship.isSmooth, hidden: isDestroyed && !isLastTurnDamaged },
    ]"
    :style="{
      zIndex: ship.isDragging ? 100 : 1,
      left: coords.x,
      top: coords.y,
      maskImage: isDestroyed
        ? 'unset'
        : shipMaskImage(ship, invalidParts, false, isDestroyed ? 75 : 20),
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
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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
  &.subShip.destroyedTheme {
    transform: translate(-8px, -6px) scale(0.96);
    mask-image: unset !important;
    &.fadeIn {
      animation: fadeIn 6s;
      & + .ship {
        animation: fadeOut 6s forwards;
      }
    }
    & + .ship {
      mask-image: unset !important;
    }
  }
  &.subShip.fireTheme.enemyOwned {
    opacity: 0;
    animation: fadeIn 2s forwards;
  }
  &.mainShip.normalTheme.enemyOwned {
    opacity: 0;
  }
  &.hidden {
    opacity: 0;
  }
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
