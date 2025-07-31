<script setup lang="ts">
import { PlayfieldBoard, PlayfieldDetails } from "./components/index";

defineOptions({
  inheritAttrs: false,
});

const game = useGameStore();
const { type } = defineProps<{ type: "player" | "enemy" }>();
const state = computed(() => {
  const status = game.gameStatus;
  const player = game.isHost ? "host" : "guest";
  const enemy = game.isHost ? "guest" : "host";
  // TODO: remove this
  return "board";
  if (type == "player") {
    if (
      [
        "arrangement",
        `${player}ArrangementWaiting`,
        `${enemy}ArrangementWaiting`,
        `${enemy}Turn`,
      ].includes(status)
    ) {
      return "board";
    }
  } else if (type == "enemy") {
    if ([`${player}Turn`].includes(status)) {
      return "board";
    }
  }
  return "details";
});
</script>
<template>
  <Transition name="fade" mode="out-in">
    <PlayfieldBoard
      v-if="state == 'board'"
      v-bind="$attrs"
      :type="type"
      key="board"
    />
    <PlayfieldDetails
      v-else
      v-bind="$attrs"
      :key="`${game.gameStatus}Details`"
      :type="type"
    />
  </Transition>
</template>
