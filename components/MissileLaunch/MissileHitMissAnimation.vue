<style lang="scss" module>
.missile-hit {
  width: calc(var(--fcell-size));
  height: calc(var(--fcell-size));
  position: absolute;
  transform: translate(-50%, -50%);
}
.missile-hit-image,
.missile-miss-image {
  position: absolute;
  width: calc(var(--fcell-size) * 1.2);
  height: calc(var(--fcell-size) * 1.2);
}
.missile-hit-image {
  transform: scale(8) translate(0%, 5%);
}
.missile-miss-image {
  transform: scale(4) translate(-2%, 3%);
}
</style>
<script setup lang="ts">
const props = defineProps<{ isHit: boolean; realX: number; realY: number }>();
</script>
<template>
  <div
    :class="$style['missile-hit']"
    :style="{ left: `${realX}px`, top: `${realY}px` }"
  >
    <img
      v-if="isHit"
      :class="$style['missile-hit-image']"
      src="/images/explosion.svg"
      alt="missile hit"
      :key="'hit' + realX + realY"
    />
    <img
      v-else
      :class="$style['missile-miss-image']"
      src="/images/spray.svg"
      alt="missile miss"
      :key="'miss' + realX + realY"
    />
  </div>
</template>
