<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";

const { count } = useCountdown(5);
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="[$style.details, 'critical']">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/skull"
        :style="{ minWidth: '80px', minHeight: '80px' }"
        :class="[$style.info, $style.error]"
      />
    </p>
    <p :class="[$style.text, $style.center]"><span>О НЕEEТ!!!</span></p>
    <p :class="[$style.text, $style.center]">
      <span>Капитан, враг полностью</span><br />
      <span :class="$style.error">уничтожил </span>
      <span>наш флот!</span>
      <br />
      <span>Мы повержены!</span>
    </p>
    <p :class="[$style.text]">
      <span>Всего выстрелов: 31</span>
      <br />
      <span>Мимо: 23</span>
      <br />
      <span>В цель: 8</span>
      <br />
      <span>Общий счет: </span><span :class="$style.error">-86 баллов</span>
    </p>
    <Button text="К статистике" variant="2" :class="$style.fightButton" />
  </div>
</template>
