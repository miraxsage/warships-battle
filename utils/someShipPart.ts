import type { ShipPart, ShipState } from "~/types/game";
import { forEachShipPart } from "./forEachShipPart";

export function someShipPart(
  ship: ShipState,
  callback: (part: ShipPart) => boolean
) {
  let someIsTrue = false;
  forEachShipPart(ship, (part) => {
    if (callback(part)) {
      someIsTrue = true;
      return false;
    }
    return true;
  });
  return someIsTrue;
}
