<style lang="scss" module>
@use "./styles.scss" as *;
</style>
<script setup lang="ts">
import * as _ from "lodash-es";
import { formatTime } from "./utils";
import EnergomoduleProgress from "./EnergomoduleProgress.vue";

const { count } = useCountdown(30);
const timeString = computed(() => formatTime(count.value));

const arrangementIsSent = ref(false);
const sendArrangement = () => {
  if (arrangementIsSent.value) {
    return;
  }
  arrangementIsSent.value = true;
};
</script>
<template>
  <div :class="$style.details">
    <p :class="$style.text">
      <SpriteSymbol name="error" :class="[$style.info, $style.error]" />
      <span>Капитан! Разветка докладывает, что противник</span>
      <span :class="$style.error"> опередил </span
      ><span
        >нас в тактике! <br />
        Его корабли уже установлены и готовы к бою!</span
      >
    </p>
    <p :class="$style.text">
      <span>Он ударит первым, когда мы выйдем на позиции!</span>
    </p>
    <p :class="$style.text">
      <span>Враг запустил активацию</span
      ><span :class="$style.error"> импульсного заряда </span
      ><span
        >, если мы не успеем установить силы, аннигиляционный залп
        дематериализует наш флот в пыль!</span
      >
    </p>
    <p :class="$style.text">
      <span>До финального</span><span :class="$style.error"> залпа </span
      ><span>противника: {{ timeString }}</span>
    </p>
    <EnergomoduleProgress
      :progress="Math.round((100 * (30 - count)) / 30)"
      mode="error"
    />
    <Button
      text="В бой!"
      :class="$style.fightButton"
      :disabled="arrangementIsSent"
      @click="sendArrangement"
    />
  </div>
</template>
