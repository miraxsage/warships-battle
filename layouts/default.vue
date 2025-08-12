<style lang="scss">
@use "@/styles/mixins.scss" as *;
@use "@/styles/colors.scss" as *;
@use "@/styles/common.scss" as *;
@use "sass:color";

html {
  font-size: 11.1px;
  @include xl {
    font-size: 12px;
  }
  @include xxl {
    font-size: 14px;
  }
  @include xxxl {
    font-size: 16px;
  }
}
body {
  font-family: "First Time Writing";
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
  .container {
    margin: auto;
    max-width: 1600px;
    @include smmm {
      max-width: 95%;
    }
    @include smm {
      max-width: 95%;
    }
    @include sm {
      max-width: 700px;
    }
    @include md {
      max-width: 1000px;
    }
    @include xl {
      max-width: 1200px;
    }
    @include xxl {
      max-width: 1400px;
    }
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
.content {
  height: var(--content-height);
}
.loaderOverlay {
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1, 1) !important;
  width: 100dvw;
  height: 100dvh;
  background-color: rgb(249, 250, 250);
  z-index: 1000;
  background-image: repeating-linear-gradient(
      270deg,
      transparent 0,
      transparent pxrem(30),
      color.change($pen-color, $lightness: 97.6%) pxrem(30),
      color.change($pen-color, $lightness: 97.6%) pxrem(32.5),
      transparent pxrem(32.5)
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent pxrem(30),
      color.change($pen-color, $lightness: 97.6%) pxrem(30),
      color.change($pen-color, $lightness: 97.6%) pxrem(32)
    );
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loader {
  animation: spin 2.3s linear infinite;
  rotate: 45deg;
  width: 100px;
  height: 120px;
  transform-origin: 125px 60px;
  position: absolute;
  left: calc(50% - 125px);
  top: calc(50% - 60px);
  filter: drop-shadow(0px 0px 0px $pen-color);
  scale: 0.7;
  @include xl {
    scale: 0.8;
  }
  @include xxl {
    scale: 0.9;
  }
  @include xxxl {
    scale: 1;
  }
}
</style>
<script setup lang="ts">
import { useElementSize, useWindowSize } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { TURN_ANIMATION_DURATION } from "@/constants/common";

const layoutRef = useTemplateRef("layoutRef");

const isLoaded = ref(false);
onMounted(() => {
  isLoaded.value = true;

  document.body.style.setProperty(
    "--turn-animation-duration",
    `${TURN_ANIMATION_DURATION}ms`
  );
});

const bgVerticalCells = 46;
const bgHorizontalCells = 40;

const {
  cellSize,
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
      '--content-height': `${
        2 * verticalCenter - (verticalCells % 2 > 0 ? 9 : 8) * cellSize
      }px`,
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
    <Header />
    <div class="content container">
      <slot />
    </div>
    <Footer />
  </div>
  <Transition name="fade">
    <div class="loaderOverlay" v-if="!isLoaded">
      <img src="/images/loader.svg" alt="loader" class="loader" />
    </div>
  </Transition>
</template>
