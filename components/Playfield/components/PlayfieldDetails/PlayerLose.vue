<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import GameResults from "./GameResults.vue";

defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="[$style.details, 'critical']">
    <p
      :class="[$style.text, $style.center]"
      :style="{ marginBottom: pxrem(10) }"
    >
      <SpriteSymbol
        name="game/skull"
        :style="{
          minWidth: pxrem(80),
          minHeight: pxrem(80),
          marginBottom: pxrem(10),
        }"
        :class="[$style.info, $style.error]"
      />
    </p>
    <p
      :class="[$style.text, $style.center]"
      :style="{ marginBottom: pxrem(10) }"
    >
      <span>О НЕEEТ!!!</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span>Капитан, враг полностью</span><br />
      <span :class="$style.error">уничтожил </span>
      <span>наш флот!</span>
      <br />
      <span>Мы повержены!</span>
    </p>
    <GameResults />
    <NuxtLink to="/" :class="$style.fightButton">
      <Button text="На главную" variant="2" />
    </NuxtLink>
  </div>
</template>
