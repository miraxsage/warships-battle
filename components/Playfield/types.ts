import type { Coord, Rotation } from "~/types/common";
import type { ShipProps } from "../Ship/types";

export type ShipState = ShipProps & {
  type: 1 | 2 | 3 | 4;
  x: Coord;
  y: Coord;
  rotation: Rotation;
  isDragging?: boolean;
  isSmooth?: boolean;
};

export type PlayfieldState = {
  fieldCoords: DOMRect;
  shipPlaceholder?: ShipState;
  ships: ShipState[];
};
