<script setup lang="ts">
import { useKeenSlider } from "keen-slider/vue";
import "keen-slider/keen-slider.min.css";
import type { AvatarId } from "./type";
import { borderImageVariants } from "~/constants/ui";
import { getRootCssVar } from "~/utils/getRootCssVar";
import * as _ from "lodash-es";
import { AVATARS_COUNT } from "~/constants/common";

const initialSlide = _.random(0, AVATARS_COUNT - 1);
const currentSlide = ref(initialSlide);

const emit = defineEmits<{
  (e: "select", avatarId: AvatarId): void;
}>();

const [container, slider] = useKeenSlider({
  slides: {
    perView: 3,
  },
  initial: initialSlide,
  slideChanged: (slider) => {
    currentSlide.value = slider.track.details.rel;
    emit("select", currentSlide.value as AvatarId);
  },
});

onMounted(() => {
  emit("select", initialSlide as AvatarId);
});
</script>
<template>
  <div class="root">
    <div class="keen-slider" ref="container">
      <div
        class="keen-slider__slide"
        :style="{ '--avatar-display': currentSlide == 0 ? 'display' : 'none' }"
      ></div>
      <div
        class="keen-slider__slide"
        v-for="avatarId in AVATARS_COUNT"
        @click="slider?.moveToIdx(avatarId - 1)"
        :key="avatarId"
        :style="{
          '--avatar-display':
            Math.abs(currentSlide - avatarId + 1) <= 1 ? 'display' : 'none',
        }"
      >
        <SpriteSymbol
          :name="`avatars/id-${avatarId as AvatarId}`"
          class="avatar-icon"
        />
      </div>
      <div
        class="keen-slider__slide"
        :style="{
          '--avatar-display':
            currentSlide == AVATARS_COUNT - 1 ? 'display' : 'none',
        }"
      ></div>
    </div>
    <div class="arrows">
      <button
        @click="slider?.prev()"
        class="arrow arrow--left"
        :disabled="currentSlide === 0"
      >
        &lt;
      </button>
      <button
        @click="slider?.next()"
        class="arrow arrow--right"
        :disabled="currentSlide === AVATARS_COUNT - 1"
      >
        &gt;
      </button>
    </div>
    <div
      class="border"
      :style="
        borderImageVariants[0]?.(getRootCssVar('penColor', 'black')) || {}
      "
    />
  </div>
</template>
<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;

.root {
  position: relative;
}
.keen-slider {
  width: calc(100% - 30px);
  margin: auto;
}
.keen-slider__slide,
.avatar-icon {
  width: calc(var(--cell-size) * 3);
  height: calc(var(--cell-size) * 3);
  min-width: calc(100% / 3);
  color: var(--pen-color);
}
.keen-slider__slide {
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow {
  border: none;
  pointer-events: all;
  background: transparent;
  font-family: inherit;
  font-size: 24px;
  color: var(--pen-color);
  will-change: transform;
  transition: all 0.1s;
  @include bold-filter;
  scale: 1.6 1;
  &:hover {
    scale: 1.8 1.2;
  }
  &:active {
    scale: 1.6 1;
  }
}
.arrows {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute;
  left: 0;
  top: 50%;
  pointer-events: none;
  transform: translateY(-50%);
}

.border {
  position: absolute;
  top: -6px;
  left: 50%;
  height: 120%;
  aspect-ratio: 1/1;
  pointer-events: none;
  transform: translateX(-50%) rotate(90deg);
  box-sizing: border-box;
}
</style>
