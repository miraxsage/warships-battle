import type { Point, Rect, Rotation } from "~/types/common";

export const TURN_ANIMATION_DURATION = 7500;

export const SHIPS_CLASSES = {
  "1": {
    name: "Разведовательный скаут",
    nameTo: "Разведовательному скауту",
    nameOf: "Разведовательных скаутов",
  },
  "2": {
    name: "Патрульный корвет",
    nameTo: "Патрульному корвету",
    nameOf: "Патрульных корветов",
  },
  "3": {
    name: "Штурмовой крейсер",
    nameTo: "Штурмовому крейсеру",
    nameOf: "Штурмовых крейсера",
  },
  "4": {
    name: "Флагманский линкор",
    nameTo: "Флагманскому линкору",
    nameOf: "Флагманских линкоров",
  },
};

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

export const ACTUAL_COORDS: Record<
  Rotation,
  (corner: Point, width: number, height: number) => Rect
> = {
  top: (corner, width, height) => ({
    x: corner.x,
    y: corner.y,
    width,
    height,
  }),
  right: (corner, width, height) => ({
    x: corner.x - height,
    y: corner.y,
    width: height,
    height: width,
  }),
  down: (corner, width, height) => ({
    x: corner.x - width,
    y: corner.y - height,
    width,
    height,
  }),
  left: (corner, width, height) => ({
    x: corner.x,
    y: corner.y - width,
    width: height,
    height: width,
  }),
};

export const PREV_ROTATION: Record<Rotation, Rotation> = {
  left: "down",
  top: "left",
  right: "top",
  down: "right",
};

export const NEXT_ROTATION: Record<Rotation, Rotation> = {
  left: "top",
  top: "right",
  right: "down",
  down: "left",
};

export const AVATARS_COUNT = 9;

export const SHIP_DIRECTION_INCREMENTS: Record<
  Rotation,
  [x: number, y: number]
> = {
  top: [0, 1],
  right: [-1, 0],
  down: [0, -1],
  left: [1, 0],
};

export const HITS_TO_WIN = 2;
