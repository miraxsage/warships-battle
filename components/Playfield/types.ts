import type { ShipProps } from "../Ship/types";

export type ShipState = ShipProps & { isDragging: boolean };

export type PlayfieldState = {
  fieldCoords: DOMRect;
  ships: ShipState[];
};
