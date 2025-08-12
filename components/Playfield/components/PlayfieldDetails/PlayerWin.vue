<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import GameResults from "./GameResults.vue";

const { count } = useCountdown(5);
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="[$style.details, 'successful']">
    <p
      :class="[$style.text, $style.center]"
      :style="{ marginBottom: pxrem(10) }"
    >
      <SpriteSymbol
        name="game/win"
        :style="{
          minWidth: pxrem(80),
          minHeight: pxrem(80),
        }"
        :class="[$style.info, $style.warning]"
      />
    </p>
    <p
      :class="[$style.text, $style.center]"
      :style="{ marginBottom: pxrem(10) }"
    >
      <span>УРААА!!!</span>
    </p>
    <p :class="[$style.text, $style.center]">
      <span
        >Капитан, мы полностью <br />
        уничтожили вражеский флот<br />
      </span>
      <span :class="$style.warning">Победа</span><span> за нами!</span>
    </p>
    <GameResults />
    <NuxtLink to="/" :class="$style.fightButton">
      <Button text="На главную" variant="2" />
    </NuxtLink>
  </div>
</template>
