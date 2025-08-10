<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";

const { count } = useCountdown(5);
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="[$style.details, 'successful']">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/win"
        :style="{ minWidth: '80px', minHeight: '80px' }"
        :class="[$style.info, $style.warning]"
      />
    </p>
    <p :class="[$style.text, $style.center]"><span>УРААА!!!</span></p>
    <p :class="[$style.text, $style.center]">
      <span>Капитан, мы успели полностью </span>
      <span :class="$style.warning">испепелить </span>
      <br />
      <span>врага мощным импульсным </span>
      <span :class="$style.warning">зарядом, </span>
      <br />
      <span>пока тот искал кнопку старта!</span>
      <br />
      <span :class="$style.warning">Так держать!</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span :class="$style.success">+5</span>
      <span> очков за медлительность врага </span>
    </p>
    <NuxtLink to="/" :class="$style.fightButton">
      <Button text="На главную" variant="2" />
    </NuxtLink>
  </div>
</template>
