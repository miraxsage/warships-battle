export function useCountdown(time?: number) {
  const startTime = Date.now();
  const count = ref(time || 0);
  const interval = ref<NodeJS.Timeout | null>(null);
  onMounted(() => {
    interval.value = setInterval(() => {
      const left = Math.floor((Date.now() - startTime) / 1000);
      count.value = time ? Math.max(0, time - left) : left;
    }, 1000);
  });
  onUnmounted(() => {
    if (interval.value) {
      clearInterval(interval.value);
    }
  });
  return { count };
}
