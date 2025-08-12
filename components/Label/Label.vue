<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;

.root {
  font-size: pxrem(24);
  color: var(--pen-color);
  @include bold-filter;
}
</style>
<template>
  <label class="root">{{ text }}</label>
</template>
<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>
