<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";

const startPhrases = [
  "Мимо!",
  "Промах!",
  "Цель не поражена!",
  "Отсутствие попадания!",
];
const startPhrase = _.sample(startPhrases);
const { count } = useCountdown(5);
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="reject"
        :style="{ minWidth: '40px', minHeight: '40px' }"
        :class="[$style.info, $style.success]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span>{{ startPhrase }}</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Капитан! К счастью противнику</span>
      <br />
      <span :class="$style.success"> не удалось </span>
      <span>поразить цель...</span>
      <br />
      <span>Снаряд прошел мимо</span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>{{ count }}</span>
    </p>
  </div>
</template>
