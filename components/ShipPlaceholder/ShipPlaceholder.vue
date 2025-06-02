<style module lang="scss">
.placeholder.placeholder {
  border: 2px solid rgb(15, 142, 9);
  background: rgba(0, 238, 71, 0.192);
  transition: all 0.4s;
}
.appear {
  animation: appear 0.3s;
}
@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<script setup lang="ts">
import { ROTATION_ANGLE } from "~/constants/common";
import { fieldStateContextKey } from "../Playfield/utils";
import { sizeContextKey } from "~/layouts/utils";
import type { ShipState } from "../Playfield/types";

const sizeState = inject(sizeContextKey)!;
const fieldState = inject(fieldStateContextKey);

const lastPlaceholder = reactive({} as ShipState);
const rotationDegree = ref(0);
const shown = ref(false);

watchEffect(() => {
  const placeholder = fieldState?.shipPlaceholder;
  if (!placeholder) {
    setTimeout(() => (shown.value = false), 300);
    return;
  }
  shown.value = true;
  Object.assign(lastPlaceholder, placeholder);

  const newRotation = ROTATION_ANGLE[placeholder.rotation];
  const oldRotation = rotationDegree.value % 360;
  if (newRotation != oldRotation) {
    const cwAngle = (360 + newRotation - oldRotation) % 360;
    const ccwAngle = (newRotation - oldRotation - 360) % 360;
    const angle = Math.abs(cwAngle) > Math.abs(ccwAngle) ? ccwAngle : cwAngle;
    rotationDegree.value += angle;
  }
});

watchEffect(() => {});
</script>
<template>
  <div
    v-if="shown"
    :class="[
      $style.placeholder,
      'ship',
      `ship${lastPlaceholder.type}`,
      { [$style.appear]: shown },
    ]"
    :style="{
      opacity: fieldState?.shipPlaceholder ? 1 : 0,
      left: lastPlaceholder.x * sizeState.fcellSize + 'px',
      top: lastPlaceholder.y * sizeState.fcellSize + 'px',
      rotate: `${rotationDegree}deg`,
    }"
  />
</template>
