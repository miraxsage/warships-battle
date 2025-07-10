<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { formatTime } from "./utils";

const game = useGameStore();
const fieldState = useFieldStore();

const { count } = useCountdown();
const timeString = computed(() => formatTime(count.value));

const arrangementIsSent = ref(false);
const sendArrangement = () => {
  if (arrangementIsSent.value) {
    return;
  }
  arrangementIsSent.value = true;
  game.sendMessage({
    type: "game:arranged",
    data: {
      arrangement: fieldState.player.ships.map((ship) => _.omit(ship, "id")),
    },
  });
};

const startPhrases = [
  "Капитан, грядет большая битва!",
  "На нас напала вражеская эскадра!",
  "Капитан, нам грозит гибель!",
  "Великий бой уже близко, Капитан!",
  "Враг приближается с востока!",
  "Капитан, готовьте орудия к бою!",
  "Морское сражение неизбежно!",
];
const startPhrase = _.sample(startPhrases);
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.inline]">
      <span>{{ startPhrase }}</span>
    </p>
    <p :class="$style.text">
      <span>Пора установить положение нашего флота на поле боя</span>
    </p>
    <p :class="[$style.text, $style.inline]">
      <SpriteSymbol name="info" :class="[$style.info, $style.success]" />
      <span>Буксируй корабли мышкой на нужную клетку,</span>
    </p>
    <p :class="$style.text">
      <span> вращай их стрелками или клавишами A (↺) и D (</span
      ><span :class="$style.cwArrow">↺</span><span>)</span>
    </p>
    <p :class="$style.text">
      <SpriteSymbol name="fire" :class="[$style.info, $style.warning]" />
      <span>Мы сможем ударить</span> <span :class="$style.warning">первыми</span
      ><span>, если установим свои позиции раньше противника!</span>
    </p>
    <p :class="$style.text">
      <SpriteSymbol name="error" :class="[$style.info, $style.error]" />
      <span>Иначе у нас останется 30 секунд</span
      ><span :class="$style.error"> до уничтожения</span
      ><span> после дислокации вражеского флота!</span>
    </p>
    <p :class="[$style.text, $style.inline]">
      <span>Разветка докладывает:</span>
    </p>
    <p :class="[$style.text, $style.inline]">
      <span>Противник разворачивает свои орудия...</span>
    </p>
    <p :class="$style.text">
      <span>Дислокация занимает: {{ timeString }}</span>
    </p>
    <Button
      text="В бой!"
      :class="$style.fightButton"
      :disabled="arrangementIsSent"
      @click="sendArrangement"
    />
  </div>
</template>
