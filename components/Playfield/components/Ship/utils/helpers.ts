import * as _ from "lodash-es";
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

export function shipMaskImage(
  ship: ShipState,
  invalidParts: number[],
  remainInvalid: boolean = false,
  smoothness: number = 0
) {
  let mask = `linear-gradient(180deg, `;
  const partSize = _.round(100 / ship.type, 2);
  const smooth = _.round(
    (partSize * 0.5 * _.clamp(smoothness, 0, 100)) / 100,
    2
  );
  let prevPartIsVisible = false;
  for (let i = 0; i < ship.type; i++) {
    if (invalidParts.includes(i) ? remainInvalid : !remainInvalid) {
      if (!prevPartIsVisible || !i) {
        if (i) {
          mask += `transparent ${partSize * i - smooth}%, `;
        }
        mask += `black ${partSize * i + smooth}%, `;
      }
      prevPartIsVisible = true;
    } else {
      if (prevPartIsVisible || !i) {
        if (i) {
          mask += `black ${partSize * i - smooth}%, `;
        }
        mask += `transparent ${partSize * i + smooth}%, `;
      }
      prevPartIsVisible = false;
    }
  }
  mask += `${prevPartIsVisible ? "black" : "transparent"} 100%)`;
  return mask;
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
