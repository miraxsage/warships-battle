<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
defineProps<{
  progress: number;
  progressText?: string;
  mode: "error" | "success";
  hint?: string;
}>();
</script>
<template>
  <div
    :class="[$style.energomoduleContainer, $style[mode]]"
    :style="`--progress: ${progress / 100}`"
  >
    <div :class="$style.missileUnderlay">
      <SpriteSymbol name="game/missile-thin" />
    </div>
    <div :class="$style.missile">
      <SpriteSymbol name="game/missile-thin" />
    </div>
  </div>
  <p :class="[$style.text, $style.center]">
    <span>{{
      `${hint || "Критическая мощность"}: ${
        progressText || `${Math.round(progress)}%`
      }`
    }}</span>
  </p>
</template>
