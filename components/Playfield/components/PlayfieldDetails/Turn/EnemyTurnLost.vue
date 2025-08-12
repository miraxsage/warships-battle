<style lang="scss" module>
@use "../styles.scss" as *;
</style>
<script setup lang="ts">
const { count } = useCountdown(10);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="fire"
        :style="{ minWidth: pxrem(40), minHeight: pxrem(40) }"
        :class="[$style.info, $style.warning]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Капитан!
        <br />
        Враг</span
      >
      <span :class="$style.success"> упустил </span>
      <span>возможность!</span>
      <br />
      <span>Не успев вовремя нанести удар</span>
      <br />
      <span>Заряд потерял минимальную мощность...</span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>{{ count }}</span>
    </p>
  </div>
</template>
