import { SHIP_DIRECTION_INCREMENTS } from "~/constants/common";
import type { Coord } from "~/types/common";
import type { ShipPart, ShipState } from "~/types/game";

export function forEachShipPart(
  ship: ShipState,
  callback: (part: ShipPart) => boolean | void
) {
  for (let part = 0; part < ship.type; part++) {
    const partX = ship.x + SHIP_DIRECTION_INCREMENTS[ship.rotation][0] * part;
    const partY = ship.y + SHIP_DIRECTION_INCREMENTS[ship.rotation][1] * part;
    if (
      callback({
        x: partX as Coord,
        y: partY as Coord,
        part: part as ShipPart["part"],
        ship,
      }) === false
    ) {
      break;
    }
  }
}
