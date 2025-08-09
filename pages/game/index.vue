<script setup lang="ts">
// Отключаем page transition для этой страницы
definePageMeta({
  pageTransition: false,
});

// Предзагрузка изображений границ
useHead({
  link: [
    {
      rel: "preload",
      href: "/images/border1.svg",
      as: "image",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      href: "/images/border2.svg",
      as: "image",
      crossorigin: "anonymous",
    },
  ],
});

const { checkAuthAndRedirect } = useGameAuth();

const gameStore = useGameStore();

const preloadImages = () => {
  const images = ["/images/border1.svg", "/images/border2.svg"];
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

onMounted(async () => {
  await checkAuthAndRedirect();
  preloadImages(); // Запускаем предзагрузку
});

onUnmounted(() => {
  gameStore.disconnect();
});

const readyToPlay = ref(false);
watchEffect(() => {
  if (gameStore.currentGame?.hostUser && gameStore.currentGame?.guestUser) {
    setTimeout(() => (readyToPlay.value = true), 1500);
  }
});
</script>

<template>
  <Transition name="pageFade" mode="out-in" appear>
    <GameStarter v-if="!readyToPlay" key="starter" />
    <Playground v-else-if="readyToPlay" key="playground" />
  </Transition>
</template>

<style lang="scss">
.pageFade-enter-active,
.pageFade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.pageFade-enter-from,
.pageFade-leave-to {
  opacity: 0;
}
</style>
