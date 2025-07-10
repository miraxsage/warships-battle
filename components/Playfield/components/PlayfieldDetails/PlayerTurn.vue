<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import EnergomoduleProgress from "./EnergomoduleProgress.vue";

const startPhrases = [
  "Мы наносим ответный удар!",
  "Наш черед бить по врагу!",
  "Цельте орудия, Капитан!",
  "К бою готовы! Огонь!",
  "Время нанести удар по врагу!",
  "Враг в зоне поражения!",
];
const startPhrase = _.sample(startPhrases);
const { count } = useCountdown(30);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol name="fire" :class="[$style.info, $style.warning]" />
      <span>{{ startPhrase }}</span>
    </p>
    <p :class="$style.text">
      <span> Необходимо установить координаты запуска ракет... </span>
    </p>
    <p :class="$style.text">
      <SpriteSymbol name="info" :class="[$style.info, $style.neutral]" />
      <span> Наводи локатор цели на позиции врага и жми пуск ЛКМ! </span>
    </p>
    <p :class="$style.text">
      <SpriteSymbol name="error" :class="[$style.info, $style.error]" />
      <span :class="$style.error">Внимание! </span>
      <span
        >Необходимо успеть нанести удар до потери фазовой стабилизации заряда:
        {{ count }} сек.</span
      >
    </p>
    <EnergomoduleProgress
      :progress="Math.floor((100 * count) / 30)"
      mode="success"
      :progressText="`${100 - Math.floor((100 * count) / 30)}%`"
      hint="Потеря стабилизации"
    />
  </div>
</template>
