<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
const { count } = useCountdown(5);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="error"
        :style="{ minWidth: '40px', minHeight: '40px' }"
        :class="[$style.info, $style.error]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Капитан!
        <br />
        Момент выстрела</span
      >
      <span :class="$style.error"> упущен</span><span>!</span>
      <br />
      <span>Мы не успели вовремя нанести удар!</span>
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
