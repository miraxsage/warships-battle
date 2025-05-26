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
