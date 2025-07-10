<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import EnergomoduleProgress from "./EnergomoduleProgress.vue";

const startPhrases = [
  "Враг наносит ответный удар!",
  "Мы в зоне поражения!",
  "Очередь противника, Капитан!",
  "Противник атакует наши позиции!",
  "Враг переходит в режим атаки!",
  "Запуск вражеских боевых систем!",
  "Противник активировал боевой протокол!",
  "Противник выходит на огневой рубеж!",
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
      <span>
        Разветка установила факт наведения боевых орудий врага по нашим
        позициям! Всем приготовиться!
      </span>
    </p>
    <p :class="$style.text">
      <SpriteSymbol name="error" :class="[$style.info, $style.error]" />
      <span :class="$style.error">Внимание! </span>
      <span
        >Противник должен успеть до потери стабилизации накопленного
        заряда.</span
      >
      <br />
      <span>Вражеский удар ожидается в пределах: {{ count }} сек.</span>
    </p>
    <EnergomoduleProgress
      :progress="Math.floor((100 * count) / 30)"
      mode="error"
      :progressText="`${100 - Math.floor((100 * count) / 30)}%`"
      hint="Потеря стабилизации"
    />
  </div>
</template>
