<script setup lang="ts">
import { TURN_ANIMATION_DURATION } from "~/constants/common";
import PlayerTurnStart from "./PlayerTurnStart.vue";
import PlayerTurnLost from "./PlayerTurnLost.vue";
import PlayerTurnHit from "./PlayerTurnHit.vue";
import PlayerTurnMiss from "./PlayerTurnMiss.vue";
import PlayerTurnLaunched from "./PlayerTurnLaunched.vue";
import EnemyTurnStart from "./EnemyTurnStart.vue";
import EnemyTurnLost from "./EnemyTurnLost.vue";
import EnemyTurnHit from "./EnemyTurnHit.vue";
import EnemyTurnMiss from "./EnemyTurnMiss.vue";
import EnemyTurnLaunched from "./EnemyTurnLaunched.vue";

const game = useGameStore();
const lastTurn = computed(() => game.lastTurn);
const isPlayerTurn = computed(() =>
  game.gameStatus.startsWith(game.playerRole)
);
const isEnemyTurn = computed(() => game.gameStatus.startsWith(game.enemyRole));
const isResultShown = ref(false);
const checkPlayerStatus = (suffix: string) => {
  return isPlayerTurn.value && game.gameStatus.endsWith(suffix);
};
const checkEnemyStatus = (suffix: string) => {
  return isEnemyTurn.value && game.gameStatus.endsWith(suffix);
};
watchEffect(() => {
  if (game.gameStatus.endsWith("TurnFinished")) {
    setTimeout(() => {
      isResultShown.value = true;
    }, TURN_ANIMATION_DURATION);
  }
});
</script>
<template>
  <Transition name="fadeText">
    <PlayerTurnStart v-if="checkPlayerStatus('Turn')" />
    <PlayerTurnLaunched
      v-else-if="checkPlayerStatus('TurnFinished') && !isResultShown"
    />
    <PlayerTurnHit
      v-else-if="isPlayerTurn && lastTurn?.result == 'hit'"
      :full-damage="lastTurn?.isShipDestroyed"
    />
    <PlayerTurnMiss v-else-if="isPlayerTurn && lastTurn?.result == 'miss'" />
    <PlayerTurnLost v-else-if="checkPlayerStatus('TurnLost')" />
    <EnemyTurnStart v-else-if="checkEnemyStatus('Turn')" />
    <EnemyTurnLaunched
      v-else-if="checkEnemyStatus('TurnFinished') && !isResultShown"
    />
    <EnemyTurnHit
      v-else-if="isEnemyTurn && lastTurn?.result == 'hit'"
      :full-damage="lastTurn?.isShipDestroyed"
    />
    <EnemyTurnMiss v-else-if="isEnemyTurn && lastTurn?.result == 'miss'" />
    <EnemyTurnLost v-else-if="checkEnemyStatus('TurnLost')" />
  </Transition>
</template>
