import type { ShipProps } from "../types";

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
  ship: ShipProps,
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
