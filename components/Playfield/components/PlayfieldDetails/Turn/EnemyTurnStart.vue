<style lang="scss" module>
@use "../styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import EnergomoduleProgress from "../EnergomoduleProgress.vue";

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

const gameStore = useGameStore();
const turnNumber = computed(() => gameStore.currentGame?.turnNumber ?? 0);
const waitTime = computed(() =>
  (gameStore.currentGame?.turnNumber ?? 0) <= 2 ? 45 : 30
);
const startPhrase =
  turnNumber.value == 1
    ? "Враг наносит удар по нам первым!"
    : _.sample(startPhrases);

const { count } = useCountdown(waitTime.value);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol name="fire" :class="[$style.info, $style.error]" />
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
      :progress="Math.floor((100 * count) / waitTime)"
      mode="error"
      :progressText="`${100 - Math.floor((100 * count) / waitTime)}%`"
      hint="Потеря стабилизации"
    />
  </div>
</template>
