import { SHIP_DIRECTION_INCREMENTS } from "~/constants/common";
import type { PlayerField } from "~/stores/field";
import type { ShipState } from "~/types/game";

export function rotatePoint(
  x: number | string,
  y: number | string,
  centerX: number | string,
  centerY: number | string,
  degrees: number
) {
  const angle = (degrees * Math.PI) / 180;
  const tx = parseFloat(x.toString());
  const ty = parseFloat(y.toString());
  const cx = parseFloat(centerX.toString());
  const cy = parseFloat(centerY.toString());
  const dx = tx - cx;
  const dy = ty - cy;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const xRotated = cx + dx * cos - dy * sin;
  const yRotated = cy + dx * sin + dy * cos;
  return { x: xRotated, y: yRotated };
}

export function shipClipPath(
  ship: ShipState,
  invalidParts: number[],
  remainInvalid: boolean = false
) {
  if (!invalidParts.length) {
    return "unset";
  }
  let result = "0% 0%";
  let yInc = 100 / ship.type;
  let curY = 0;
  for (let i = 0; i < ship.type; i++) {
    if (invalidParts.includes(i) ? remainInvalid : !remainInvalid) {
      result += `, 100% ${curY}%, 100% ${(curY += yInc)}%, 0% ${curY}%`;
    } else {
      result += `, 0% ${(curY += yInc)}%`;
    }
  }
  return `polygon(${result})`;
}

export function getFieldMap(fieldState: PlayerField, withoutShipId: string) {
  const map: string[][] = [];
  for (let ship of fieldState.ships) {
    if (ship.id == withoutShipId) {
      continue;
    }
    (map[ship.x] || (map[ship.x] = []))[ship.y] = ship.id;
    const [dx, dy] = SHIP_DIRECTION_INCREMENTS[ship.rotation];
    for (let i = 1; i < ship.type; i++) {
      (map[ship.x + dx * i] || (map[ship.x + dx * i] = []))[ship.y + dy * i] =
        ship.id;
    }
  }
  return map;
}
