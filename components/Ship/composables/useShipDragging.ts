import type { ShallowRef } from "vue";
import { sizeContextKey } from "~/layouts/utils";
import { fieldStateContextKey } from "~/components/Playfield/utils";
import { rotatePoint } from "../utils/helpers";
import {
  NEXT_ROTATION,
  ROTATION_ANGLE,
  ROTATION_CENTER,
} from "../utils/constants";
import { useShipCoordination } from "./useShipCoordination";

type UseDragOptions = {
  shipId: string;
  initial: {
    x: number | string;
    y: number | string;
  };
};

export function useShipDragging<T extends HTMLElement>(
  el: ShallowRef<T | null>,
  { shipId, initial }: UseDragOptions
) {
  const fieldState = inject(fieldStateContextKey);
  const sizeState = inject(sizeContextKey);

  const coords = reactive({
    x: initial.x || 0,
    y: initial.y || 0,
    displaceX: 0,
    displaceY: 0,
  });

  const shipCoordination = useShipCoordination(el, { coords, shipId });

  watch(
    el,
    (el, _, onCleanup) => {
      if (!el) {
        return;
      }
      const dragHandler = (event: MouseEvent) => {
        const shipState = fieldState?.ships.find(({ id }) => id == shipId);
        if (!shipState || !fieldState || !sizeState) {
          return;
        }
        shipState.isDragging = true;
        const shipRect = el.getBoundingClientRect();
        const fieldRect = el.parentElement!.getBoundingClientRect();

        coords.displaceX = event.pageX - shipRect.left;
        coords.displaceY = event.pageY - shipRect.top;
        coords.x = `${shipRect.left - fieldRect.left}px`;
        coords.y = `${shipRect.top - fieldRect.top}px`;

        if (shipState.rotation != "top") {
          const currentCenter = ROTATION_CENTER[shipState.rotation](
            shipRect.width,
            shipRect.height
          );
          const displaceInInitialCoords = rotatePoint(
            coords.displaceX,
            coords.displaceY,
            currentCenter.x,
            currentCenter.y,
            -ROTATION_ANGLE[shipState.rotation]
          );
          displaceInInitialCoords.x += sizeState.cellSize - currentCenter.x;
          displaceInInitialCoords.y += sizeState.cellSize - currentCenter.y;
          coords.displaceX = displaceInInitialCoords.x;
          coords.displaceY = displaceInInitialCoords.y;
          const centerInNewCoords = rotatePoint(
            sizeState.cellSize,
            sizeState.cellSize,
            displaceInInitialCoords.x,
            displaceInInitialCoords.y,
            ROTATION_ANGLE[shipState.rotation]
          );
          const dx = centerInNewCoords.x - currentCenter.x;
          const dy = centerInNewCoords.y - currentCenter.y;

          coords.x = `${parseFloat(coords.x.toString()) - dx}px`;
          coords.y = `${parseFloat(coords.y.toString()) - dy}px`;
        }

        const moveHandler = (event: MouseEvent) => {
          coords.x = `${event.pageX - fieldRect.left - coords.displaceX}px`;
          coords.y = `${event.pageY - fieldRect.top - coords.displaceY}px`;
        };

        const keyHandler = (event: KeyboardEvent) => {
          if (!fieldState) {
            return;
          }
          if (event.code == "ControlLeft" || event.code == "ControlRight") {
            shipState.rotation = NEXT_ROTATION[shipState.rotation];
          }
        };
        window.addEventListener("keyup", keyHandler);
        window.addEventListener("mousemove", moveHandler);
        window.addEventListener(
          "mouseup",
          () => {
            shipState.isDragging = false;
            window.removeEventListener("mousemove", moveHandler);
            window.removeEventListener("keyup", keyHandler);
            let angle = ROTATION_ANGLE[shipState.rotation];

            const { x: xRotated, y: yRotated } = rotatePoint(
              sizeState.cellSize,
              sizeState.cellSize,
              coords.displaceX,
              coords.displaceY,
              angle
            );

            coords.x = `${
              parseFloat(coords.x.toString()) + xRotated - sizeState.cellSize
            }px`;
            coords.y = `${
              parseFloat(coords.y.toString()) + yRotated - sizeState.cellSize
            }px`;
            coords.displaceX = 0;
            coords.displaceY = 0;
          },
          { once: true }
        );
      };
      el.addEventListener("mousedown", dragHandler);
      onCleanup(() => el.removeEventListener("mousemove", dragHandler));
    },
    { immediate: true }
  );
  return { coords, shipCoordination };
}
