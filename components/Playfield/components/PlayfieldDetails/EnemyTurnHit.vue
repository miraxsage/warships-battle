<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";

const startPhrases = [
  "Прямое попадание!",
  "Точно в цель!",
  "Есть урон по противнику!",
  "Снаряд достиг цели!",
];
const startPhrase = _.sample(startPhrases);
const { count } = useCountdown(5);
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="fire"
        :style="{ minWidth: '40px', minHeight: '40px' }"
        :class="[$style.info, $style.error]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span>{{ startPhrase }}</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Противник попал по нашему кораблю</span>
      <br />
      <span :class="$style.error" v-if="fullDamage">Он уничтожен! </span>
      <span :class="$style.warning" v-else>Он поврежден! </span>
      <span>Держать оборону!</span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>{{ count }}</span>
    </p>
  </div>
</template>
