<style lang="scss" module>
@use "../styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { TURN_ANIMATION_DURATION } from "~/constants/common";

const startPhrases = [
  "Запуск произведен! [Ракета уже в пути]!",
  "Пуск подтвержден! [Боеголовка запущена]!",
  "Есть координаты, [запуск произведен]!",
  "Цель захвачена - [пошел пуск]!",
  "Наведение завершено - [огонь]!",
];
const startPhrase = _.sample(startPhrases);
const { count } = useCountdown(_.toInteger(TURN_ANIMATION_DURATION / 1000));

const parsedPhrase = computed(() => {
  if (!startPhrase) return [];

  const parts = [];
  const regex = /(\[.*?\])|([^\[\]]+)/g;
  let match;

  while ((match = regex.exec(startPhrase)) !== null) {
    if (match[1]) {
      parts.push({
        text: match[1].slice(1, -1),
        isWarning: true,
      });
    } else if (match[2]) {
      parts.push({
        text: match[2],
        isWarning: false,
      });
    }
  }

  return parts;
});
defineProps<{ fullDamage?: boolean }>();
const gameStore = useGameStore();
const hitSector = computed(() => {
  const lastTurn = gameStore.lastTurn;
  if (!lastTurn) return "X";
  return coordsToSector(lastTurn.x, lastTurn.y);
});
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/rocket"
        :style="{ minWidth: pxrem(50), minHeight: pxrem(50) }"
        :class="[$style.info, $style.pen]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        v-for="(part, index) in parsedPhrase"
        :key="index"
        :class="{ [String($style.warning)]: part.isWarning }"
      >
        {{ part.text }}
      </span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Капитан, боеголовка успешно выпущена <br />
        по установленным координатам!</span
      >
      <br />
      <span>Вражеский сектор {{ hitSector }} под огнем!</span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>Время подлета: {{ count }} сек.</span>
    </p>
  </div>
</template>
