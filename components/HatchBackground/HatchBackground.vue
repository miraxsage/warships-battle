<style scoped>
.hatches-root {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  display: grid;
  overflow: hidden;
}
.hatch {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: currentColor;
  mask-image: url("/images/hatch.svg");
  mask-size: 100% 100%;
  rotate: -90deg;
  translate: calc(var(--column) * -10%) calc(var(--row) * -10%);
}
</style>
<script setup lang="ts">
const { size = 55 } = defineProps<{ size?: number }>();

const rootRef = useTemplateRef("root");
const xHatches = ref(0);
const yHatches = ref(0);

watchEffect((onCleanup) => {
  if (!rootRef.value) {
    return;
  }
  const observer = new ResizeObserver(() => {
    if (!rootRef.value) {
      return;
    }
    const rootRect = rootRef.value.getBoundingClientRect();
    xHatches.value = Math.ceil(Math.max(1, rootRect.width / (size * 0.9)));
    yHatches.value = Math.ceil(Math.max(1, rootRect.height / (size * 0.9)));
  });
  observer.observe(rootRef.value!);
  onCleanup(() => observer.disconnect());
});
</script>
<template>
  <div
    class="hatches-root"
    ref="root"
    :style="{
      gridTemplateColumns: `repeat(${xHatches}, ${size}px)`,
      gridAutoRows: `${size}px`,
    }"
  >
    <div
      :class="['hatch']"
      :style="{
        ['--column']: (i - 1) % xHatches,
        ['--row']: Math.floor((i - 1) / xHatches),
        ['--index']: i,
      }"
      v-for="i in xHatches * yHatches"
    ></div>
  </div>
</template>
