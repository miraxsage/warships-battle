import { useResizeObserver } from "@vueuse/core";

export function usePlayfield(
  root: Ref<HTMLElement | null>,
  type: "player" | "enemy"
) {
  const fieldState = useFieldStore();
  const onRearrangeHandler = () => {
    setTimeout(() => {
      if (root.value) {
        fieldState[type].fieldCoords = root.value.getBoundingClientRect();
      }
    });
  };
  onMounted(() => {
    window.addEventListener("resize", onRearrangeHandler);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", onRearrangeHandler);
  });
  useResizeObserver(root, onRearrangeHandler);
  return { fieldState };
}
