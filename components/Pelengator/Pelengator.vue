<style lang="scss">
@use "@/styles/colors.scss" as *;

.left-line,
.right-line,
.top-line,
.bottom-line {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.12, 0.61, 0.4, 0.95);
}
.left-line:before,
.right-line:before,
.top-line:before,
.bottom-line:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--pen-color);
  mask-image: url("./images/dash-line.svg");
  mask-repeat: no-repeat;
  mask-position: center;
}
.left-line,
.right-line {
  width: calc(101% - var(--fcell-size));
  height: calc(var(--fcell-size) * 0.5);
  translate: 0 -50%;
}
.top-line,
.bottom-line {
  width: calc(var(--fcell-size) * 0.5);
  height: calc(101% - var(--fcell-size));
  translate: -40% 0;
}
.right-line:before {
  scale: -1 -1;
}
.bottom-line {
  scale: -1 -1;
}
.top-line:before {
  height: calc(var(--fcell-size) * 0.5);
  width: calc(var(--fcell-size) * 9.25);
  transform-origin: calc(var(--fcell-size) * 0.25)
    calc(var(--fcell-size) * 0.25);
  rotate: 90deg;
}
.bottom-line:before {
  height: calc(var(--fcell-size) * 0.5);
  width: calc(var(--fcell-size) * 9.25);
  transform-origin: calc(var(--fcell-size) * 0.25)
    calc(var(--fcell-size) * 0.25);
  rotate: 90deg;
}
.pelengator-container {
  --shift: calc(var(--fcell-size) * 0.38);
  position: absolute;
  width: calc(100% + var(--shift) * 2);
  height: calc(100% + var(--shift) * 2);
  left: calc(-0.9 * var(--shift));
  top: calc(-1 * var(--shift));
  filter: drop-shadow(1px 0.5px 0px rgba($pen-color, 0.7));
}
.pelengator {
  left: calc(var(--fcell-size) * 0.3);
  top: calc(var(--fcell-size) * 0.4);
  width: calc(var(--fcell-size) * 10.1);
  height: calc(var(--fcell-size) * 10.1);
  overflow: hidden;
  position: absolute;
  &,
  & > * {
    cursor: none;
  }
}
.pelengator-sight {
  width: calc(var(--fcell-size) * 1.5);
  height: calc(var(--fcell-size) * 1.5);
  left: 12px;
  top: 16px;
  position: absolute;
  background-color: var(--pen-color);
  mask-image: url("./images/pelengator.svg");
  mask-size: 100% 100%;
  transition: all 0.5s cubic-bezier(0.12, 0.61, 0.4, 0.95);
}
.sight {
  position: absolute;
  width: calc(var(--fcell-size) * 1.2);
  height: calc(var(--fcell-size) * 1.2);
  background-color: var(--pen-color);
  mask-image: url("./images/sight.svg");
  translate: -50% -50%;
  cursor: none;
}
.ruler-pos-v,
.ruler-pos-h {
  width: calc(var(--fcell-size) * 0.4);
  height: var(--fcell-size);
  position: absolute;
  background: rgba($pen-color, 0.05);
  border: 0px solid rgba($pen-color, 0.5);
  border-width: 2px 0px 2px 0px;
  transition: all 0.5s cubic-bezier(0.12, 0.61, 0.4, 0.95);
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--pen-color);
    mask-image: url("./images/hatch.svg");
    mask-size: cover;
  }
}
.ruler-pos-h {
  height: calc(var(--fcell-size) * 0.4);
  width: var(--fcell-size);
  border-width: 0px 2px 0px 2px;
}
</style>
<script setup>
import { templateRef } from "@vueuse/core";
import { usePelengatorDragging } from "./composables/usePelengatorDragging";
const pelengatorRef = templateRef("pelengator");
const scaleState = useScaleStore();
const coords = usePelengatorDragging(pelengatorRef);
const fcellSz = computed(() => scaleState.fcellSize);
</script>
<template>
  <div class="pelengator-container">
    <div class="pelengator" ref="pelengator">
      <div
        class="top-line"
        :style="{
          left: `${(coords.x + 0.5) * fcellSz}px`,
          bottom: `${(10 - coords.y) * fcellSz + fcellSz * 0.3}px`,
        }"
      />
      <div
        class="bottom-line"
        :style="{
          left: `${(coords.x + 0.5) * fcellSz}px`,
          top: `${(coords.y + 1) * fcellSz + fcellSz * 0.25}px`,
        }"
      />
      <div
        class="left-line"
        :style="{
          right: `${(10 - coords.x) * fcellSz + fcellSz * 0.3}px`,
          top: `${(coords.y + 0.5) * fcellSz}px`,
        }"
      />
      <div
        class="right-line"
        :style="{
          left: `${(coords.x + 1) * fcellSz + fcellSz * 0.25}px`,
          top: `${(coords.y + 0.5) * fcellSz}px`,
        }"
      />
      <div
        class="pelengator-sight"
        :style="{
          left: `${coords.x * fcellSz - fcellSz * 0.23}px`,
          top: `${coords.y * fcellSz - fcellSz * 0.22}px`,
        }"
      />
      <div
        class="sight"
        :style="{ left: `${coords.realX}px`, top: `${coords.realY}px` }"
      />
    </div>
    <div
      class="ruler-pos-v"
      :style="{ top: `${(coords.y + 0.4) * fcellSz}px` }"
    />
    <div
      class="ruler-pos-h"
      :style="{ left: `${(coords.x + 0.3) * fcellSz}px` }"
    />
  </div>
</template>
