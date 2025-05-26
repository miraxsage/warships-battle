export type Coord = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Rotation = "top" | "right" | "down" | "left";
export type ShipProps = {
  id: string;
  type: "1" | "2" | "3" | "4";
  x: Coord;
  y: Coord;
  rotation: Rotation;
};
