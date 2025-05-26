<style lang="scss">
body {
  margin: 0;
  --cell-size: 10px;
  @media (width >= 400px) {
    --cell-size: 12px;
  }
  @media (width >= 500px) {
    --cell-size: 14px;
  }
  @media (width >= 1024px) {
    --cell-size: 16px;
  }
  @media (width >= 1280px) {
    --cell-size: 18px;
  }
  @media (width >= 1440px) {
    --cell-size: 20px;
  }
  @media (width >= 1920px) {
    --cell-size: 22px;
  }
  & * {
    user-select: none;
  }
}
.layout {
  position: relative;
  height: calc(max(100dvh, calc(var(--cell-size) * 35)));
  overflow: hidden;
  @media (width < 1024px) {
    height: calc(max(100dvh, calc(var(--fcell-size) * 27)));
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
import { sizeContextKey } from "./utils";

const layoutRef = useTemplateRef("layoutRef");

const bgVerticalCells = 46;
const bgHorizontalCells = 40;

const cellSize = ref(0);
const verticalCells = ref(0);
const horizontalCells = ref(0);
const verticalCenter = ref(0);
const horizontalCenter = ref(0);

const sizeContext = reactive({
  cellSize,
  verticalCells,
  verticalCenter,
  horizontalCells,
  horizontalCenter,
});

const { width: windowWidth, height: windowHeight } = useWindowSize();
const { height: templateHeight, width: templateWidth } =
  useElementSize(layoutRef);

provide(sizeContextKey, sizeContext);

watchEffect(() => {
  if (!isBrowser() || !windowWidth.value || !windowHeight.value) {
    return;
  }
  console.log("SCK", sizeContext);
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
