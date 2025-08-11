<script setup lang="ts">
const props = defineProps<{
  user: "player" | "enemy";
  align?: "left" | "right";
}>();

const gameStore = useGameStore();
const score = computed(() => {
  return props.user === "player" ? gameStore.playerScore : gameStore.enemyScore;
});
const opponentScore = computed(() => {
  return props.user === "player" ? gameStore.enemyScore : gameStore.playerScore;
});
const stats = computed(() => {
  return props.user === "player" ? gameStore.playerStats : gameStore.enemyStats;
});
const opponentStats = computed(() => {
  return props.user === "player" ? gameStore.enemyStats : gameStore.playerStats;
});
</script>

<template>
  <div :class="[$style.container, align && $style[align]]">
    <div :class="$style.stat" key="turns">
      <SpriteSymbol name="game/rocket" :class="[$style.icon, $style.rocket]" />
      <span>{{ stats?.turns || 0 || "–" }}</span>
    </div>
    <div :class="$style.stat" v-show="stats?.hits" key="hits">
      <SpriteSymbol name="fire" :class="[$style.icon, $style.fire]" />
      <span>{{ stats?.hits }}</span>
    </div>
    <div
      :class="$style.stat"
      v-show="stats?.misses || stats?.skipped"
      key="misses"
    >
      <SpriteSymbol name="reject" :class="[$style.icon, $style.miss]" />
      <span>{{ stats?.misses + stats?.skipped }}</span>
    </div>
    <div
      :class="$style.stat"
      v-show="stats?.hits || opponentStats?.hits"
      key="score"
    >
      <SpriteSymbol
        name="game/stats"
        :class="[
          $style.icon,
          $style.score,
          {
            [$style.win]: score > opponentScore,
            [$style.lose]: score < opponentScore,
            [$style.tie]: score === opponentScore,
          },
        ]"
      />
      <span>{{ score }}</span>
    </div>
  </div>
</template>
<style lang="scss" module>
@use "@/styles/mixins" as *;
@use "@/styles/colors" as *;

.container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon {
  width: 28px;
  height: 28px;
}
.fire {
  color: #d4762d;
  @include bold-filter(#d4762d);
  scale: 1 0.8;
}
.miss {
  color: #bb2727;
  @include bold-filter(#bb2727);
  scale: 0.7;
}
.rocket {
  @include bold-filter;
}
.score {
  position: relative;
  top: -2px;
  width: 32px;
  height: 32px;
  &.win {
    color: #107946;
    @include bold-filter(#107946);
  }
  &.lose {
    color: #bb2727;
    @include bold-filter(#bb2727);
  }
  &.tie {
    color: $pen-color;
    @include bold-filter($pen-color);
  }
}
.stat {
  order: 10;
  font-size: 22px;
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 4px;
  span {
    @include bold-filter;
  }
  &:has(.score) {
    font-size: 28px;
    position: relative;
    top: -2px;
    margin-left: 5px;
    margin-right: 5px;
    .right & {
      order: 1;
    }
  }
}

@keyframes statFrames {
  0% {
    opacity: 0;
    max-width: 0;
  }
  50% {
    max-width: 100px;
  }
  100% {
    opacity: 1;
  }
}
.stat-enter-active {
  animation: statFrames 0.5s;
}
.stat-leave-active {
  animation: statFrames 0.5s reverse;
}
</style>
