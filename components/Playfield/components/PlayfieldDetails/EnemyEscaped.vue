<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/rat"
        :style="{ minWidth: pxrem(80), minHeight: pxrem(80) }"
        :class="[$style.info, $style.neutral]"
      />
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Похоже, что противник просто</span>
      <br />
      <span :class="$style.error"> сбежал </span><span> с поля боя ... </span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Тем самым он теряет </span><span :class="$style.error">-10</span
      ><span> очков рейтинга.</span>
    </p>

    <p :class="[$style.text, $style.center]">
      <span>Мы же в свою очередь получаем </span
      ><span :class="$style.success">+10</span>
    </p>
    <NuxtLink to="/" :class="$style.fightButton">
      <Button text="На главную" variant="2" />
    </NuxtLink>
  </div>
</template>
