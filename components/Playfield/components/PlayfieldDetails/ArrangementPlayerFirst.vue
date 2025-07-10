<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { formatTime } from "./utils";
import EnergomoduleProgress from "./EnergomoduleProgress.vue";

const { count } = useCountdown(30);
const timeString = computed(() => formatTime(count.value));
</script>
<template>
  <div :class="$style.details">
    <p :class="$style.text">
      <SpriteSymbol name="fire" :class="[$style.info, $style.warning]" />
      <span>Капитан! Разветка докладывает, что мы сумели</span>
      <span :class="$style.warning"> опередить </span
      ><span
        >противника в тактике! <br />
        Корабли установлены и готовы к бою!</span
      >
    </p>
    <p :class="$style.text">
      <span>Мы ударим его первыми, когда он выйдет на позиции!</span>
    </p>
    <p :class="$style.text">
      <span>Запущена активация</span
      ><span :class="$style.success"> импульсного заряда </span
      ><span
        >, если враг не успеет установить силы, наш аннигиляционный залп
        дематериализует вражеский флот в пыль!</span
      >
    </p>
    <p :class="$style.text">
      <span>До</span><span :class="$style.error"> уничтожения </span
      ><span>противника: {{ timeString }}</span>
    </p>
    <EnergomoduleProgress
      :progress="Math.round((100 * (30 - count)) / 30)"
      mode="success"
    />
  </div>
</template>
