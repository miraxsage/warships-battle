<style lang="scss" module>
@use "../styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { HITS_TO_WIN, SHIPS_CLASSES } from "~/constants/common";

const startPhrases = [
  "Прямое попадание!",
  "Точно в цель!",
  "Есть урон по противнику!",
  "Снаряд достиг цели!",
];
const startPhrase = _.sample(startPhrases);
const gameStore = useGameStore();
const { count } = useCountdown(gameStore.lastTurn?.isShipDestroyed ? 15 : 10);
const fieldStore = useFieldStore();
const damagedShipDetails = computed(() => {
  const lastTurn = gameStore.lastTurn;
  if (!lastTurn) return;
  return fieldStore.getShipDetailsByCoords()(lastTurn.x, lastTurn.y, "player");
});
const damagedShip = computed(() => damagedShipDetails.value?.ship);
const fullDamage = computed(() => gameStore.lastTurn?.isShipDestroyed);
const playerHasWon = computed(() => gameStore.playerStats.hits == HITS_TO_WIN);
const iconSize = computed(() => (playerHasWon.value ? "60px" : "40px"));
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        :name="playerHasWon ? 'game/win' : 'fire'"
        :style="{ minWidth: iconSize, minHeight: iconSize }"
        :class="[$style.info, $style.warning]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span>{{ startPhrase }}</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Мы точно попали во вражеский корабль!</span>
      <br />
      <span :class="$style.success" v-if="!fullDamage"> Он поврежден! </span>
      <span :class="$style.success" v-else> Он полностью уничтожен! </span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span v-if="!fullDamage">
        Разведка не может установить его
        <br />
        класс,пока борт находится в строю
      </span>
      <span v-if="fullDamage && damagedShip">
        Разветка докладывает: это был
        <br />
        боевой
        {{ SHIPS_CLASSES[damagedShip?.type].name.toLowerCase() }},
        <br />
        {{
          ["одна", "две", "три", "четыре"][(damagedShip.type ?? 1) - 1] +
          (damagedShip.type == 1 ? " секция выведена " : " секции выведены ")
        }}
        из строя
      </span>
    </p>
    <p :class="[$style.text, $style.center]" v-if="playerHasWon">
      <span>Похоже у противника не осталось кораблей,</span>
      <br />
      <span
        >разветка устанавливает состояние
        <br />
        флота противника...</span
      >
    </p>
    <p :class="[$style.text, $style.center]">
      <span v-if="!fullDamage">Так держать, капитан!</span>
    </p>
    <p
      :style="{ opacity: count > 0 ? 1 : 0 }"
      :class="[$style.text, $style.center]"
    >
      <span>{{ count }}</span>
    </p>
  </div>
</template>
