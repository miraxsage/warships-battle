<style module lang="scss">
$easing: cubic-bezier(0.85, 0.61, 0.93, 0.69);
$duration: var(--turn-animation-duration);

@keyframes missile-flight {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}
@keyframes missile-flight-scaling {
  0% {
    scale: 0.5;
    clip-path: inset(0 0 0 100%);
  }
  4% {
    clip-path: inset(0 0 0 -115%);
  }
  60% {
    scale: 1;
  }
  99.6% {
    clip-path: inset(0 0 0 -115%);
  }
  100% {
    scale: 0.6;
    clip-path: inset(0 100% 0 0);
  }
}

.missile-launch {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  width: calc(var(--fcell-size) * 22);
  height: calc(var(--fcell-size) * 10);
  top: calc(
    var(--cell-size) * max(10, (var(--v-cells) - var(--v-cells-odd) - 20) / 2) -
      3px
  );
  left: calc(
    max(
        var(--cell-size),
        var(--horizontal-center) - var(--fcell-size) * 11 - var(--cell-size)
      ) - 1px
  );
}

.missile {
  animation: missile-flight-scaling #{$duration} #{$easing} forwards;
}

.missile-position-tracker {
  offset-path: v-bind(offsetPath);
  offset-distance: 0%;
  offset-rotate: auto;
  animation: missile-flight #{$duration} #{$easing};
}

.extract-trailed-path {
  path {
    stroke-dasharray: var(--path-length) var(--path-length);
    stroke-dashoffset: 0;
    transition: stroke-dashoffset #{$duration} #{$easing};
  }
  &.start path {
    stroke-dashoffset: calc(var(--path-length) * -1);
  }
}

.hide-track {
  opacity: 0;
  transition: opacity 7s;
}

.invert {
  scale: -1 1;
}
</style>

<script setup lang="ts">
import * as _ from "lodash-es";
import Missle from "./Missle.vue";
import paths from "./paths";
import { templateRef } from "@vueuse/core";
import { computed, ref, watchEffect } from "vue";
import MissileHitMissAnimation from "./MissileHitMissAnimation.vue";
import { useGameStore } from "@/stores/game";
import { TURN_ANIMATION_DURATION } from "@/constants/common";

const gameStore = useGameStore();
const x = computed(() => gameStore.lastTurn?.x ?? 0);
const y = computed(() => gameStore.lastTurn?.y ?? 0);
const isHit = computed(() => gameStore.lastTurn?.result === "hit");
const showHitMiss = ref(false);
const hideTrack = ref(false);
const direction = computed(() =>
  gameStore.gameStatus == `${gameStore.enemyRole}TurnFinished`
    ? "rightToLeft"
    : "leftToRight"
);

setTimeout(() => {
  hideTrack.value = true;
}, 0.9 * TURN_ANIMATION_DURATION);

const missileLaunch = templateRef<HTMLDivElement>("missileLaunch");
const scale = useScaleStore();

const selectedPath = _.sample(paths)!;
const offsetPath = `path('${selectedPath.path}')`;
const pathLength = getPathLength(selectedPath.path);

const startY = computed(() => _.random(3, 7) * scale.fcellSize);
const startX = 0;

const endX = computed(() => {
  const X = direction.value == "rightToLeft" ? 9 - x.value : x.value;
  return (
    missileLaunch.value?.clientWidth -
    (9 - X) * scale.fcellSize -
    scale.cellSize
  );
});
const endY = computed(
  () =>
    missileLaunch.value?.clientHeight -
    (9 - y.value) * scale.fcellSize -
    scale.cellSize
);

const routeTransform = ref("");
const revertTransform = ref("");

const startedRef = ref(false);

onMounted(() => {
  startedRef.value = true;
  startPreciseTimer();
});

const animationStartTime = ref<number>(0);

const startPreciseTimer = () => {
  animationStartTime.value = performance.now();

  const checkTime = () => {
    const elapsed = performance.now() - animationStartTime.value;
    if (elapsed >= 0.97 * TURN_ANIMATION_DURATION) {
      showHitMiss.value = true;
    } else {
      requestAnimationFrame(checkTime);
    }
  };

  requestAnimationFrame(checkTime);
};

watchEffect(() => {
  // координаты начала и конца пути
  const { x: x1, y: y1 } = selectedPath.startPoint;
  const { x: x2, y: y2 } = selectedPath.endPoint;

  const sx = startX;
  const sy = startY.value ?? 0;
  const ex = endX.value ?? 0;
  const ey = endY.value ?? 0;

  // вектор пути
  const ax = x2 - x1;
  const ay = y2 - y1;
  // целевой вектор
  const bx = ex - sx;
  const by = ey - sy;
  // длины
  const lenA = Math.sqrt(ax * ax + ay * ay);
  const lenB = Math.sqrt(bx * bx + by * by);
  // масштаб
  const localScale = lenB / lenA;
  // поворот
  const angleA = Math.atan2(ay, ax);
  const angleB = Math.atan2(by, bx);
  const localRotate = ((angleB - angleA) * 180) / Math.PI;

  // итоговый transform: только scale и rotate вокруг начальной точки
  routeTransform.value =
    `translate(-${selectedPath.startPoint.x}px, ${
      startY.value - selectedPath.startPoint.y
    }px) ` + `rotate(${localRotate}deg) scale(${localScale})`;
  revertTransform.value = `scale(${1 / localScale})`;
});
</script>

<template>
  <div
    :class="[
      $style['missile-launch'],
      { [$style['invert']]: direction == 'rightToLeft' },
    ]"
    ref="missileLaunch"
    :style="`mix-blend-mode: darken; --path-length: ${pathLength}`"
  >
    <div
      :style="`
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        transform-origin: ${selectedPath.startPoint.x}px ${selectedPath.startPoint.y}px;
        transform: ${routeTransform};
        display: grid;
      `"
      :class="{ [String($style['hide-track'])]: hideTrack }"
    >
      <svg
        :width="selectedPath.width"
        :height="selectedPath.height"
        :viewBox="`0 0 ${selectedPath.width} ${selectedPath.height}`"
        :style="`
        grid-area: 1/1/2/2;
      `"
        :class="[
          $style['extract-trailed-path'],
          { [$style.start]: startedRef },
        ]"
      >
        <path
          :d="selectedPath.path"
          stroke="white"
          fill="none"
          stroke-width="1"
          stroke-dasharray="50%"
        />
      </svg>
      <svg
        :width="selectedPath.width"
        :height="selectedPath.height"
        :viewBox="`0 0 ${selectedPath.width} ${selectedPath.height}`"
        :style="`
        mix-blend-mode: difference;
        grid-area: 1/1/2/2;
      `"
      >
        <path
          :d="selectedPath.path"
          stroke="black"
          fill="none"
          stroke-width="0.2"
          stroke-dasharray="4 4"
        />
      </svg>
    </div>
  </div>
  <div
    :class="[
      $style['missile-launch'],
      { [$style['invert']]: direction == 'rightToLeft' },
    ]"
  >
    <div
      :style="`
        transform-origin: ${selectedPath.startPoint.x}px ${selectedPath.startPoint.y}px;
        transform: ${routeTransform};
      `"
    >
      <div
        :class="$style['missile-position-tracker']"
        :style="`transform: ${revertTransform};width:fit-content;`"
      >
        <Missle :class="$style.missile" />
      </div>
    </div>
    <MissileHitMissAnimation
      v-if="showHitMiss"
      :is-hit="isHit"
      :real-x="endX"
      :real-y="endY"
    />
  </div>
</template>
