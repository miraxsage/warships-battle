<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
const { count } = useCountdown(10);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="fire"
        :style="{ minWidth: '40px', minHeight: '40px' }"
        :class="[$style.info, $style.warning]"
      />
    </p>
    <p :class="$style.text">
      <span>Противник и мы</span>
      <span :class="$style.warning"> заняли тактические позиции </span>
      <span>на фронте!</span>
      <span> Взоры команд нацелены на боевую зону... </span>
    </p>
    <p :class="$style.text">
      <span>
        Все расчёты завершены и модули приведены в боевую готовность!
      </span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span :class="$style.warning"> Притоговься </span
      ><span>к неминуемому бою!</span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>{{ count }}</span>
    </p>
  </div>
</template>
