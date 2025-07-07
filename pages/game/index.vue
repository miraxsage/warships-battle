<script setup lang="ts">
const { checkAuthAndRedirect } = useGameAuth();

onMounted(async () => {
  await checkAuthAndRedirect();
});
</script>

<template>
  <GameStarter />
</template>
