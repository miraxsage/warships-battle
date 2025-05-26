import type { ShallowRef } from "vue";
import type { Rotation } from "./types";
import { fieldStateContextKey } from "../Playfield/utils";
import { rotatePoint } from "./utils";
import { sizeContextKey } from "~/layouts/utils";

type UseDragOptions = {
  shipId: string;
  initial: {
    x: number | string;
    y: number | string;
  };
};
type Point = { x: number; y: number };

const ROTATION_ANGLE: Record<Rotation, number> = {
  top: 0,
  right: 90,
  down: 180,
  left: 270,
};
const ROTATION_CENTER: Record<
  Rotation,
  (width: number, height: number) => Point
> = {
  top: (w, _h) => ({ x: w / 2, y: w / 2 }),
  right: (w, h) => ({ x: w - h / 2, y: h / 2 }),
  down: (w, h) => ({ x: w / 2, y: h - w / 2 }),
  left: (_w, h) => ({ x: h / 2, y: h / 2 }),
};
const NEXT_ROTATION: Record<Rotation, Rotation> = {
  left: "top",
  top: "right",
  right: "down",
  down: "left",
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
  watch(
    el,
    (el, _, onCleanup) => {
      if (!el) {
        return;
      }
      const dragHandler = (event: MouseEvent) => {
        const shipState = fieldState?.find(({ id }) => id == shipId);
        if (!shipState || !fieldState || !sizeState) {
          return;
        }
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

        //
        // const currentCenter = ROTATION_CENTER[shipState.rotation](
        //   shipRect.width,
        //   shipRect.height
        // );
        // const tx = currentCenter.x;
        // const ty = currentCenter.y;
        // const cx = coords.displaceX;
        // const cy = coords.displaceY;
        // const { x: rx, y: ry } = rotatePoint(
        //   tx,
        //   ty,
        //   cx,
        //   cy,
        //   -ROTATION_ANGLE[shipState.rotation]
        // );
        // const dx = rx - tx;
        // const dy = ry - ty;
        // coords.x = `${parseFloat(coords.x.toString()) + dx}px`;
        // coords.y = `${parseFloat(coords.y.toString()) + dy}px`;

        // if (shipState.rotation != rotationBeforeDrag) {
        // let angle =
        //   ROTATION_ANGLE[shipState.rotation] -
        //   ROTATION_ANGLE[rotationBeforeDrag];
        // let angle = ROTATION_ANGLE[shipState.rotation];
        // angle *= Math.PI / 180;

        // const dx = tx - cx;
        // const dy = ty - cy;
        // const cos = Math.cos(angle);
        // const sin = Math.sin(angle);
        // const dxRotated = cx + dx * cos - dy * sin - tx;
        // const dyRotated = cy + dx * sin + dy * cos - ty;

        // coords.x = `${parseFloat(coords.x.toString()) + dxRotated}px`;
        // coords.y = `${parseFloat(coords.y.toString()) + dyRotated}px`;
        //
        const rotationBeforeDrag = shipState?.rotation;

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
            window.removeEventListener("mousemove", moveHandler);
            window.removeEventListener("keyup", keyHandler);
            let angle = ROTATION_ANGLE[shipState.rotation];
            const centerBeforeDrag = ROTATION_CENTER[rotationBeforeDrag](
              shipRect.width,
              shipRect.height
            );

            const { x: xRotated, y: yRotated } = rotatePoint(
              sizeState.cellSize,
              sizeState.cellSize,
              // centerBeforeDrag.x,
              // centerBeforeDrag.y,
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
  return coords;
}
