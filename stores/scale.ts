import { defineStore } from "pinia";

export const useScaleStore = defineStore("scale", () => {
  const cellSize = ref(0);
  const fcellSize = computed(() => cellSize.value * 2);
  const verticalCells = ref(0);
  const horizontalCells = ref(0);
  const verticalCenter = ref(0);
  const horizontalCenter = ref(0);
  return {
    cellSize,
    fcellSize,
    verticalCells,
    verticalCenter,
    horizontalCells,
    horizontalCenter,
  };
});
