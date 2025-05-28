import type { Point, Rotation } from "../types";

export const ROTATION_ANGLE: Record<Rotation, number> = {
  top: 0,
  right: 90,
  down: 180,
  left: 270,
};

export const ROTATION_CENTER: Record<
  Rotation,
  (width: number, height: number) => Point
> = {
  top: (w, _h) => ({ x: w / 2, y: w / 2 }),
  right: (w, h) => ({ x: w - h / 2, y: h / 2 }),
  down: (w, h) => ({ x: w / 2, y: h - w / 2 }),
  left: (_w, h) => ({ x: h / 2, y: h / 2 }),
};

export const NEXT_ROTATION: Record<Rotation, Rotation> = {
  left: "top",
  top: "right",
  right: "down",
  down: "left",
};
