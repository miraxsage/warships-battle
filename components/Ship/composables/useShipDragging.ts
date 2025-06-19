import type { ShallowRef } from "vue";
import { rotatePoint } from "../utils/helpers";
import { useShipCoordination } from "./useShipCoordination";
import {
  NEXT_ROTATION,
  PREV_ROTATION,
  ROTATION_ANGLE,
  ROTATION_CENTER,
} from "~/constants/common";
import * as _ from "lodash-es";
const lodash = _;

export function useShipDragging<T extends HTMLElement>(
  el: ShallowRef<T | null>,
  shipId: string
) {
  const scaleState = useScaleStore();
  const { player: fieldState } = useFieldStore();
  const shipState = useShip(shipId)!;

  const coords = reactive({
    x: `calc(var(--fcell-size) * ${shipState.x})`,
    y: `calc(var(--fcell-size) * ${shipState.y})`,
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
        if (!shipState || !fieldState || !scaleState) {
          return;
        }
        fieldState.shipPlaceholder = { ...shipState };
        shipState.isDragging = true;
        shipState.isSmooth = false;
        const shipRect = el.getBoundingClientRect();
        const fieldRect = el.parentElement!.getBoundingClientRect();

        coords.displaceX = event.clientX - shipRect.left;
        coords.displaceY = event.clientY - shipRect.top;
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
          displaceInInitialCoords.x += scaleState.cellSize - currentCenter.x;
          displaceInInitialCoords.y += scaleState.cellSize - currentCenter.y;
          coords.displaceX = displaceInInitialCoords.x;
          coords.displaceY = displaceInInitialCoords.y;
          const centerInNewCoords = rotatePoint(
            scaleState.cellSize,
            scaleState.cellSize,
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
          coords.x = `${event.clientX - fieldRect.left - coords.displaceX}px`;
          coords.y = `${event.clientY - fieldRect.top - coords.displaceY}px`;
        };

        const keyHandler = (event: KeyboardEvent) => {
          if (!fieldState) {
            return;
          }
          if (event.code == "ArrowRight" || event.code == "KeyD") {
            shipState.rotation = NEXT_ROTATION[shipState.rotation];
          }
          if (event.code == "ArrowLeft" || event.code == "KeyA") {
            shipState.rotation = PREV_ROTATION[shipState.rotation];
          }
          window.focus();
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
              scaleState.cellSize,
              scaleState.cellSize,
              coords.displaceX,
              coords.displaceY,
              angle
            );

            coords.x = `${
              parseFloat(coords.x.toString()) + xRotated - scaleState.cellSize
            }px`;
            coords.y = `${
              parseFloat(coords.y.toString()) + yRotated - scaleState.cellSize
            }px`;
            coords.displaceX = 0;
            coords.displaceY = 0;

            lodash.defer(() => {
              shipState.isSmooth = true;
              shipState.x = fieldState.shipPlaceholder!.x;
              shipState.y = fieldState.shipPlaceholder!.y;
              shipState.rotation = fieldState.shipPlaceholder!.rotation;
              fieldState.shipPlaceholder = undefined;
              shipState.isDragging = false;
              coords.x = `calc(var(--fcell-size) * ${shipState.x})`;
              coords.y = `calc(var(--fcell-size) * ${shipState.y})`;
              lodash.delay(() => (shipState.isSmooth = false), 500);
            });
          },
          { once: true }
        );
      };
      el.addEventListener("mousedown", dragHandler);
      onCleanup(() => {
        el.removeEventListener("mousedown", dragHandler);
      });
    },
    { immediate: true }
  );
  return { coords, shipCoordination };
}
