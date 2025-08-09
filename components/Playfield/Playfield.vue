<script setup lang="ts">
import { PlayfieldBoard, PlayfieldDetails } from "./components/index";

defineOptions({
  inheritAttrs: false,
});

const game = useGameStore();
const props = defineProps<{
  type: "player" | "enemy";
  isOnlyPlayerMessage: boolean;
}>();
const isByOneMessageHidden = computed(() => {
  return props.type != "player" && props.isOnlyPlayerMessage;
});

const state = computed(() => {
  const status = game.gameStatus;
  const player = game.isHost ? "host" : "guest";
  const enemy = game.isHost ? "guest" : "host";
  if (props.type == "player") {
    if (
      [
        "arrangement",
        `${player}ArrangementWaiting`,
        `${enemy}ArrangementWaiting`,
        `${enemy}Turn`,
        `${enemy}TurnFinished`,
      ].includes(status)
    ) {
      return "board";
    }
  } else if (props.type == "enemy") {
    if ([`${player}Turn`, `${player}TurnFinished`].includes(status)) {
      return "board";
    }
  }
  return "details";
});

const detailsKey = computed(() => {
  let key = isByOneMessageHidden.value ? "hidden" : "shown";
  if (game.gameStatus == "arrangementFinished") {
    key += "arrangementFinished";
  } else if (game.gameStatus.match(/arrangement/i)) {
    key += "arrangement";
  } else if (
    new RegExp(`${game.playerRole}Turn(Finished)?$`).test(game.gameStatus)
  ) {
    key += `${game.playerRole}Turn`;
  } else if (
    new RegExp(`${game.enemyRole}Turn(Finished)?$`).test(game.gameStatus)
  ) {
    key += `${game.enemyRole}Turn`;
  } else {
    key += game.gameStatus;
  }
  return key;
});
</script>
<template>
  <div :class="$style.root">
    <Transition name="fadePlayfield" mode="out-in">
      <PlayfieldBoard
        v-if="state == 'board'"
        v-bind="$attrs"
        :type="type"
        key="board"
      />
      <PlayfieldDetails
        v-else-if="state == 'details'"
        v-bind="$attrs"
        :key="`${detailsKey}Details`"
        :type="type"
        :empty="isByOneMessageHidden"
      />
    </Transition>
  </div>
</template>
<style lang="scss" module>
.root:not(:has(:global(:is(.critical, .successful):first-of-type))) {
  mix-blend-mode: darken;
}
</style>
