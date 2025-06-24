import type { ShallowRef } from "vue";

export function useHatchBackground<T extends HTMLElement>(
  rootRef: ShallowRef<T | null>,
  size: number
) {
  watch(rootRef, (rootRef, _old, onCleanup) => {
    if (!rootRef || size < 10) {
      return;
    }
    const sizeObservable = new ResizeObserver(() => {});
    sizeObservable.observe(rootRef);
    onCleanup(() => sizeObservable.disconnect());
  });
}
