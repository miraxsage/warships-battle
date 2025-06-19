import type { ShallowRef } from "vue";
import * as _ from "lodash-es";

export function usePelengatorDragging<T extends HTMLElement>(
  el: ShallowRef<T | null>
) {
  const coords = reactive({ x: 0, y: 0, realX: 0, realY: 0 });
  const scaleState = useScaleStore();

  watch(el, (el, _old, onCleanup) => {
    if (!el) {
      return;
    }
    const moveHandler = (event: MouseEvent) => {
      const pelengatorRect = el.getBoundingClientRect();
      const x = event.clientX - pelengatorRect.x;
      const y = event.clientY - pelengatorRect.y;
      coords.x = _.clamp(Math.floor(x / scaleState.fcellSize), 0, 9);
      coords.y = _.clamp(Math.floor(y / scaleState.fcellSize), 0, 9);
      coords.realX = x;
      coords.realY = y;
    };

    el.addEventListener("mousemove", moveHandler);
    onCleanup(() => {
      el.removeEventListener("mousemove", moveHandler);
    });
  });

  return coords;
}
