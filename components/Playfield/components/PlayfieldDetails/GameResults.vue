<template>
    <p :class="$style.results">
        <div />
        <span>Мы</span>
        <span>Противник</span>
        <span>Всего выстрелов</span>
        <span>{{ playerStats.turns }}</span>
        <span>{{ enemyStats.turns }}</span>
        <span>Мимо</span>
        <span>{{ playerStats.misses }}</span>
        <span>{{ enemyStats.misses }}</span>
        <span>В цель</span>
        <span>{{ playerStats.hits }}</span>
        <span>{{ enemyStats.hits }}</span>
        <span>Пропущено ходов</span>
        <span>{{ playerStats.skipped }}</span>
        <span>{{ enemyStats.skipped }}</span>
        <span>Общий счет</span>
        <span :class="[playerHasWon ? $style.success : $style.error]">
            {{ playerHasWon ? '+' : '' }}{{ declension(playerStats.hits - enemyStats.hits, ['балл', 'балла', 'баллов'], true) }}
        </span>
        <span :class="[playerHasWon ? $style.error : $style.success]">
            {{ playerHasWon ? '' : '+' }}{{ declension(enemyStats.hits - playerStats.hits, ['балл', 'балла', 'баллов'], true) }}
        </span>
    </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { declension } from "~/utils/declention";
import { useGameStore } from "~/stores/game";

const gameStore = useGameStore();

const playerStats = computed(() => gameStore.playerStats);
const enemyStats = computed(() => gameStore.enemyStats);
const playerHasWon = computed(() => gameStore.playerStats.hits > gameStore.enemyStats.hits);
</script>

<style lang="scss" module>
@use "./styles.scss" as *;
</style>
