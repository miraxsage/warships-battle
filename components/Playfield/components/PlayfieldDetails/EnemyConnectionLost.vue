<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
const { count } = useCountdown(60);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/no-internet"
        :style="{ minWidth: pxrem(60), minHeight: pxrem(60) }"
        :class="[$style.info, $style.neutral]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span> Противник</span
      ><span :class="$style.error"> потерял соединение </span
      ><span> с сервером... </span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Ожидаем попытки переподключения {{ count }} сек.</span>
    </p>
  </div>
</template>
