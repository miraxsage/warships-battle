import { defineStore } from "pinia";
import type { FieldTurn, ShipPart, ShipState } from "~/types/game";

export type ShipStateDetailed = ShipState & {
  id: string;
  isDragging?: boolean;
  isSmooth?: boolean;
};

export type PlayerField = ReturnType<typeof useFieldStore>["player"];
export type EnemyField = ReturnType<typeof useFieldStore>["enemy"];

export const useFieldStore = defineStore("field", () => {
  const field = reactive({
    player: {
      fieldCoords: {} as DOMRect,
      shipPlaceholder: undefined as ShipStateDetailed | undefined,
      ships: [
        { id: "4-ship", type: 4, x: 0, y: 6, rotation: "top" },
        { id: "3-ship-1", type: 3, x: 1, y: 7, rotation: "top" },
        { id: "3-ship-2", type: 3, x: 2, y: 7, rotation: "top" },
        { id: "2-ship-1", type: 2, x: 3, y: 8, rotation: "top" },
        { id: "2-ship-2", type: 2, x: 4, y: 8, rotation: "top" },
        { id: "2-ship-3", type: 2, x: 5, y: 8, rotation: "top" },
        { id: "1-ship-1", type: 1, x: 6, y: 9, rotation: "top" },
        { id: "1-ship-2", type: 1, x: 7, y: 9, rotation: "top" },
        { id: "1-ship-3", type: 1, x: 8, y: 9, rotation: "top" },
        { id: "1-ship-4", type: 1, x: 9, y: 9, rotation: "top" },
      ] as ShipStateDetailed[],
      turnsMap: [] as FieldTurn[][],
    },
    enemy: {
      fieldCoords: {} as DOMRect,
      turnsMap: [] as FieldTurn[][],
      ships: [] as ShipStateDetailed[],
    },
  });

  const getShipDetailsByCoords =
    () => (x: number, y: number, owner: "player" | "enemy") => {
      let resultShip: ShipStateDetailed | undefined;
      let resultShipPart: ShipPart | undefined;
      field[owner].ships.forEach((ship) => {
        forEachShipPart(ship, (part) => {
          if (part.x === x && part.y === y) {
            resultShip = ship;
            resultShipPart = part;
            return false;
          }
          return true;
        });
        if (resultShip) {
          return false;
        }
        return true;
      });
      if (resultShip) {
        return {
          ship: resultShip,
          part: resultShipPart,
        };
      }
      return undefined;
    };

  function resetPlayerField() {
    // Сбрасываем корабли к изначальным позициям
    field.player.ships = [
      { id: "4-ship", type: 4, x: 0, y: 6, rotation: "top" },
      { id: "3-ship-1", type: 3, x: 1, y: 7, rotation: "top" },
      { id: "3-ship-2", type: 3, x: 2, y: 7, rotation: "top" },
      { id: "2-ship-1", type: 2, x: 3, y: 8, rotation: "top" },
      { id: "2-ship-2", type: 2, x: 4, y: 8, rotation: "top" },
      { id: "2-ship-3", type: 2, x: 5, y: 8, rotation: "top" },
      { id: "1-ship-1", type: 1, x: 6, y: 9, rotation: "top" },
      { id: "1-ship-2", type: 1, x: 7, y: 9, rotation: "top" },
      { id: "1-ship-3", type: 1, x: 8, y: 9, rotation: "top" },
      { id: "1-ship-4", type: 1, x: 9, y: 9, rotation: "top" },
    ] as ShipStateDetailed[];
    field.player.shipPlaceholder = undefined;
  }

  return { ...field, resetPlayerField, getShipDetailsByCoords };
});
