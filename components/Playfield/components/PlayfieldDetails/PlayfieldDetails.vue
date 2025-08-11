<style lang="scss">
@use "~/styles/mixins" as *;
@use "~/styles/colors" as *;

.undefinite-details {
  @include bold-filter;
  font-size: 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.border1.frameOnly:before {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    0% 0%,
    3% 3%,
    3% 97%,
    97% 97%,
    97% 3%,
    3% 3%
  );
}
.border2.frameOnly:before {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    0% 0%,
    2% 3%,
    2% 97%,
    97% 97%,
    97% 3%,
    3% 3%
  );
}
.playfield-message:not(
    :has(:global(:is(.critical, .successful):first-of-type))
  ) {
  mix-blend-mode: darken;
}

.playfield-message:has(:is(.critical, .successful):first-of-type):after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: unset;
  box-shadow: inset 0 0 145px 34px rgb(202 41 41 / 91%);
  border-radius: 20px;
  mix-blend-mode: overlay;
  scale: 1.1;
  translate: 5px -1px;
  pointer-events: none;
}
.playfield-message:has(.critical:first-of-type):after {
  translate: 3px 2px;
}
.playfield-message:has(.successful:first-of-type):after {
  background-color: unset;
  box-shadow: inset 0 0 145px 20px #008142;
}
</style>
<script setup lang="ts">
import ArrangementEnemyFirst from "./ArrangementEnemyFirst.vue";
import ArrangementFinished from "./ArrangementFinished.vue";
import ArrangementPlayerFirst from "./ArrangementPlayerFirst.vue";
import ArrangementStart from "./ArrangementStart.vue";
import EnemyConnectionLost from "./EnemyConnectionLost.vue";
import EnemyEscaped from "./EnemyEscaped.vue";
import PlayerArrangementLose from "./PlayerArrangementLose.vue";
import PlayerArrangementWin from "./PlayerArrangementWin.vue";
import Turn from "./Turn/Turn.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  type: "player" | "enemy";
  empty?: boolean;
}>();

const gameStore = useGameStore();
const gameStatus = computed(() => gameStore.gameStatus);
const playerRole = computed(() => gameStore.playerRole);
const enemyRole = computed(() => gameStore.enemyRole);

const _is = (status: string) => {
  return gameStatus.value == status;
};

const defaultStatusDetails = computed(() => {
  switch (gameStatus.value) {
    case "failed":
      return "Ошибка";
    case "connecting":
      return "Подключение...";
  }
  return gameStatus.value;
});
</script>
<template>
  <div
    class="playfield-message"
    v-bind="$attrs"
    :style="empty ? 'display: none' : ''"
  >
    <div :class="[props.type == 'player' ? 'border1' : 'border2', 'frameOnly']">
      <Transition name="fadeText">
        <Turn v-if="gameStatus?.match(/Turn(Finished|Lost)?$/)" />
        <EnemyConnectionLost
          v-else-if="_is(`${enemyRole}ConnectionRepairingWaiting`)"
        />
        <EnemyEscaped v-else-if="_is(`${enemyRole}Exited`)" />
        <PlayerArrangementWin v-else-if="_is(`${enemyRole}ArrangementLose`)" />
        <PlayerArrangementLose
          v-else-if="_is(`${playerRole}ArrangementLose`)"
        />
        <ArrangementFinished v-else-if="_is('arrangementFinished')" />
        <ArrangementStart v-else-if="_is('arrangement')" />
        <ArrangementPlayerFirst
          v-else-if="_is(`${enemyRole}ArrangementWaiting`)"
        />
        <ArrangementEnemyFirst
          v-else-if="_is(`${playerRole}ArrangementWaiting`)"
        />
        <div v-else class="undefinite-details">{{ defaultStatusDetails }}</div>
      </Transition>
    </div>
  </div>
</template>
