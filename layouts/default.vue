<style lang="scss">
@use "@/styles/mixins.scss" as *;
@use "@/styles/colors.scss" as *;

body {
  margin: 0;
  --pen-color: #{$pen-color};
  @include smmm {
    --cell-size: 13px;
  }
  @include smm {
    --cell-size: 16px;
  }
  @include sm {
    --cell-size: 18px;
  }
  @include md {
    --cell-size: 20px;
  }
  @include xl {
    --cell-size: 22px;
  }
  @include xxl {
    --cell-size: 26px;
  }
  @include xxxl {
    --cell-size: 30px;
  }
  & * {
    user-select: none;
  }
}
.layout {
  position: relative;
  height: calc(max(100dvh, calc(var(--cell-size) * 36)));
  overflow: hidden;
  @media (width < 1024px) {
    height: calc(max(100dvh, calc(var(--fcell-size) * 30)));
  }
}
.topBg,
.bottomBg {
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  width: 100dvw;
  height: var(--bg-height, 800px);
  background-image: url("/images/bg.jpg");
  background-size: var(--bg-scale-x) var(--bg-scale-y);
}
.bottomBg {
  scale: 1 -1;
}
</style>
<script setup lang="ts">
import { useElementSize, useWindowSize } from "@vueuse/core";
import { storeToRefs } from "pinia";

const layoutRef = useTemplateRef("layoutRef");

const bgVerticalCells = 46;
const bgHorizontalCells = 40;

const {
  cellSize,
  fcellSize,
  verticalCells,
  verticalCenter,
  horizontalCells,
  horizontalCenter,
} = storeToRefs(useScaleStore());

const { width: windowWidth, height: windowHeight } = useWindowSize();
const { height: templateHeight, width: templateWidth } =
  useElementSize(layoutRef);

watchEffect(() => {
  if (!isBrowser() || !windowWidth.value || !windowHeight.value) {
    return;
  }
  cellSize.value = getRootSizeCssVar("cellSize") ?? 0;

  verticalCells.value = Math.ceil(templateHeight.value / cellSize.value);
  horizontalCells.value = Math.ceil(templateWidth.value / cellSize.value);
  verticalCenter.value =
    Math.ceil(verticalCells.value / 2) * cellSize.value + cellSize.value * 0.04;
  horizontalCenter.value =
    Math.ceil(horizontalCells.value / 2) * cellSize.value;
});
</script>
<template>
  <div
    class="layout"
    ref="layoutRef"
    :style="{
      '--bg-scale-x': `${cellSize * bgHorizontalCells}px`,
      '--bg-scale-y': `${cellSize * bgVerticalCells}px`,
      '--v-cells': `${verticalCells}`,
      '--h-cells': `${horizontalCells}`,
      '--v-cells-odd': verticalCells % 2,
      '--h-cells-odd': horizontalCells % 2,
      '--bg-height': `${verticalCenter}px`,
      '--cell-size': `${cellSize}px`,
      '--fcell-size': `${cellSize * 2}px`,
      '--vertical-center': `${verticalCenter}px`,
      '--horizontal-center': `${horizontalCenter}px`,
    }"
  >
    <div class="topBg" :style="{ height: verticalCenter + 'px' }" />
    <div
      class="bottomBg"
      :style="{
        height: `${verticalCenter + (verticalCells % 2 > 0 ? -cellSize : 0)}px`,
        top: `${verticalCenter - cellSize * 0.08}px`,
      }"
    />
    <slot />
  </div>
</template>
