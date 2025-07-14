<style lang="scss">
@use "~/styles/mixins" as *;
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
.playfield-message {
  mix-blend-mode: darken;
}
</style>
<script setup lang="ts">
import ArrangementEnemyFirst from "./ArrangementEnemyFirst.vue";
import ArrangementFinished from "./ArrangementFinished.vue";
import ArrangementPlayerFirst from "./ArrangementPlayerFirst.vue";
import ArrangementStart from "./ArrangementStart.vue";
import EnemyConnectionLost from "./EnemyConnectionLost.vue";
import EnemyEscaped from "./EnemyEscaped.vue";
import EnemyTurn from "./EnemyTurn.vue";
import EnemyTurnLost from "./EnemyTurnLost.vue";
import PlayerTurn from "./PlayerTurn.vue";
import PlayerTurnLost from "./PlayerTurnLost.vue";

const gameStore = useGameStore();
const status = computed(() => gameStore.currentGame?.status);
const playerRole = computed(() => gameStore.playerRole);
const enemyRole = computed(() => gameStore.enemyRole);

defineOptions({
  inheritAttrs: false,
});

const { type } = defineProps<{ type: "player" | "enemy" }>();
</script>
<template>
  <div class="playfield-message" v-bind="$attrs">
    <div :class="[type == 'player' ? 'border1' : 'border2', 'frameOnly']">
      <template v-if="type == 'player'">
        <EnemyConnectionLost
          v-if="status == `${enemyRole}ConnectionRepairingWaiting`"
        />
        <EnemyEscaped v-else-if="status == `${enemyRole}Exited`" />
        <ArrangementFinished v-else-if="status == 'arrangementFinished'" />
        <PlayerTurn v-else-if="status == `${playerRole}Turn`" />
        <PlayerTurnLost v-else-if="status == `${playerRole}TurnLost`" />
        <EnemyTurnLost v-else-if="status == `${enemyRole}TurnLost`" />
        <div v-else class="undefinite-details">{{ status }}</div>
      </template>
      <template v-else>
        <ArrangementStart v-if="status == 'arrangement'" />
        <ArrangementPlayerFirst
          v-else-if="status == `${enemyRole}ArrangementWaiting`"
        />
        <ArrangementEnemyFirst
          v-else-if="status == `${playerRole}ArrangementWaiting`"
        />
        <EnemyTurn v-else-if="status == `${enemyRole}Turn`" />
        <div v-else class="undefinite-details">{{ status }}</div>
      </template>
    </div>
  </div>
</template>
