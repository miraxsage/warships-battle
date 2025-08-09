const SECTOR_COLS = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"];
export const coordsToSector = (x: number, y: number) => {
  return `${SECTOR_COLS[x]}-${y + 1}`;
};
