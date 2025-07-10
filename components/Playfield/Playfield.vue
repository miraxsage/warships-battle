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
  if (type == "player") {
    if (
      [`${enemy}Turn`].includes(status) ||
      ["arrangement", `${player}ArrangementWaiting`].includes(status)
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
  <Transition name="fade">
    <PlayfieldBoard v-if="state == 'board'" v-bind="$attrs" :type="type" />
    <PlayfieldDetails v-else v-bind="$attrs" :type="type" />
  </Transition>
</template>
