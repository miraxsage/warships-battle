<style lang="scss" module>
@use "../styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { TURN_ANIMATION_DURATION } from "~/constants/common";

interface TextPart {
  text: string;
  isWarning: boolean;
  isLineBreak?: boolean;
}

const startPhrases = [
  "Враг активировал пуск! [Ракета уже в пути]!",
  "Вражеская ракета вышла на курс! \n[Готовимся к удару]!",
  "На радаре обнаружена [вражеская ракета]!",
  "Выпущена вражеская [боеголовка]\n по нашим позициям!",
  "Враг инициировал пуск! [Ракета приближается]!",
];
const startPhrase = _.sample(startPhrases);
const { count } = useCountdown(_.toInteger(TURN_ANIMATION_DURATION / 1000));

const parsedPhrase = computed((): TextPart[] => {
  if (!startPhrase) return [];

  const parts: TextPart[] = [];
  const regex = /(\[.*?\])|([^\[\]]+)/g;
  let match;

  while ((match = regex.exec(startPhrase)) !== null) {
    if (match[1]) {
      parts.push({
        text: match[1].slice(1, -1),
        isWarning: true,
      });
    } else if (match[2]) {
      const textParts = match[2].split("\n");
      textParts.forEach((textPart, index) => {
        if (textPart) {
          parts.push({
            text: textPart,
            isWarning: false,
          });
        }
        if (index < textParts.length - 1) {
          parts.push({
            text: "",
            isWarning: false,
            isLineBreak: true,
          });
        }
      });
    }
  }

  return parts;
});
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/rocket"
        :style="{ minWidth: '50px', minHeight: '50px' }"
        :class="[$style.info, $style.pen]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <template v-for="(part, index) in parsedPhrase" :key="index">
        <br v-if="part.isLineBreak" />
        <span v-else :class="{ [String($style.warning)]: part.isWarning }">
          {{ part.text }}
        </span>
      </template>
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Капитан! <br />Противник выпустил боеголовку<br />
        по нашим позициям!
      </span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>Время подлета: {{ count }} сек.</span>
    </p>
  </div>
</template>
