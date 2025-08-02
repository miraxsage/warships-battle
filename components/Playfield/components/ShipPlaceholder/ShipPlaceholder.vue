<style module lang="scss">
.placeholder.placeholder {
  transition: all 0.4s;
  background-color: rgba(178, 255, 137, 0.06);
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    mask-image: var(--frame-bg);
    background-color: rgb(58, 133, 83);
    mask-size: 100% 100%;
    scale: 1.17 1.05;
  }
  & > div {
    mask-image: url(/images/hatch.svg);
    mask-size: 100% 100%;
    background-color: rgb(88 184 38);
    width: var(--fcell-size);
    height: var(--fcell-size);
    position: relative;
    scale: 1.1;
  }
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
import * as _ from "lodash-es";

const scaleState = useScaleStore();
const { player: fieldState } = useFieldStore();

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
      '--frame-bg': `url(/images/rect${lastPlaceholder.type}.svg)`,
      opacity: fieldState?.shipPlaceholder ? 1 : 0,
      left: lastPlaceholder.x * scaleState.fcellSize + 'px',
      top: lastPlaceholder.y * scaleState.fcellSize + 'px',
      rotate: `${rotationDegree}deg`,
    }"
  >
    <div v-for="num in lastPlaceholder?.type" />
  </div>
</template>
