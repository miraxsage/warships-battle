<style lang="scss">
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
</style>
<script setup lang="ts">
import ArrangementEnemyFirst from "./ArrangementEnemyFirst.vue";
import ArrangementPlayerFirst from "./ArrangementPlayerFirst.vue";
import ArrangementInfo from "./ArrangementStart.vue";
import ArrangementFinished from "./ArrangementFinished.vue";
import EnemyTurnInfo from "./EnemyTurn.vue";
import PlayerTurnLost from "./PlayerTurnLost.vue";
import EnemyTurnLost from "./EnemyTurnLost.vue";
import PlayerTurnHit from "./PlayerTurnHit.vue";
import PlayerTurnMiss from "./PlayerTurnMiss.vue";
import EnemyTurnMiss from "./EnemyTurnMiss.vue";
import EnemyTurnHit from "./EnemyTurnHit.vue";
import PlayerWin from "./PlayerWin.vue";
import PlayerLose from "./PlayerLose.vue";

defineOptions({
  inheritAttrs: false,
});

const { type } = defineProps<{ type: "player" | "enemy" }>();
</script>
<template>
  <div class="playfield-message" v-bind="$attrs">
    <div :class="[type == 'player' ? 'border1' : 'border2', 'frameOnly']">
      <!-- <ArrangementInfo /> -->
      <PlayerWin />
    </div>
  </div>
</template>
