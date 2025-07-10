<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";

const { count } = useCountdown(5);
defineProps<{ fullDamage?: boolean }>();
</script>
<template>
  <div :class="$style.details">
    <p :class="[$style.text, $style.center]">
      <SpriteSymbol
        name="game/win"
        :style="{ minWidth: '80px', minHeight: '80px' }"
        :class="[$style.info, $style.warning]"
      />
    </p>
    <p :class="[$style.text, $style.center]"><span>УРААА!!!</span></p>
    <p :class="[$style.text, $style.center]">
      <span
        >Капитан, мы полностью <br />
        уничтожили вражеский флот<br />
      </span>
      <span :class="$style.warning">Победа</span><span> за нами!</span>
    </p>
    <p :class="[$style.text]">
      <span>Всего выстрелов: 31</span>
      <br />
      <span>Мимо: 23</span>
      <br />
      <span>В цель: 8</span>
      <br />
      <span>Общий счет: </span><span :class="$style.success">+86 баллов</span>
    </p>
    <Button text="К статистике" variant="2" :class="$style.fightButton" />
  </div>
</template>
