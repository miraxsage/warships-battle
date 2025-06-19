import type { ShallowRef } from "vue";
import * as _ from "lodash-es";
import type { Coord, Rotation } from "~/types/common";
import { rotatePoint } from "../utils/helpers";
import { ACTUAL_COORDS, ROTATION_ANGLE } from "~/constants/common";

type UseCoordinationOptions = {
  shipId: string;
  coords: {
    x: number | string;
    y: number | string;
    displaceX: number;
    displaceY: number;
  };
};

const SHIP_DIRECTION_INCREMENTS: Record<Rotation, [x: number, y: number]> = {
  top: [0, 1],
  right: [-1, 0],
  down: [0, -1],
  left: [1, 0],
};

function getFieldMap(fieldState: PlayerField, withoutShipId: string) {
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

export function useShipCoordination<T extends HTMLElement>(
  _el: ShallowRef<T | null>,
  { shipId, coords }: UseCoordinationOptions
) {
  const { player: fieldState } = useFieldStore();
  const scaleState = useScaleStore();

  const state = reactive({
    invalidParts: [] as number[],
  });

  watchEffect(() => {
    if (!fieldState?.ships.find(({ id }) => id == shipId)?.isDragging) {
      state.invalidParts = [];
      return;
    }
    const fieldMap = fieldState && getFieldMap(fieldState, shipId);
    const ship = _.find(fieldState?.ships, { id: shipId });

    if (!fieldState || !ship || !scaleState || !fieldMap) {
      return;
    }

    const ax = parseInt(coords.x.toString());
    const ay = parseInt(coords.y.toString());
    const angle = ROTATION_ANGLE[ship.rotation];
    const actualCoordsCorner = rotatePoint(
      ax,
      ay,
      ax + coords.displaceX,
      ay + coords.displaceY,
      angle
    );
    const actualCoords = ACTUAL_COORDS[ship.rotation](
      actualCoordsCorner,
      scaleState.fcellSize,
      ship.type * scaleState.fcellSize
    );

    const x = actualCoords.x;
    const y = actualCoords.y;
    state.invalidParts = [];
    const isVertical = !!ship.rotation.match(/top|down/);
    const isHorizontal = !!ship.rotation.match(/left|right/);
    if (
      (isVertical &&
        (x < 0 || x + scaleState.fcellSize > fieldState.fieldCoords.width)) ||
      (isHorizontal &&
        (y < 0 || y + scaleState.fcellSize > fieldState.fieldCoords.height))
    ) {
      state.invalidParts = [..._.range(ship?.type)];
    } else {
      const upOverY = Math.max(0, -y);
      const downOverY = Math.max(
        0,
        !isVertical
          ? 0
          : y + ship.type * scaleState.fcellSize - fieldState.fieldCoords.height
      );
      const leftOverX = Math.max(0, -x);
      const rightOverX = Math.max(
        0,
        !isHorizontal
          ? 0
          : x + ship.type * scaleState.fcellSize - fieldState.fieldCoords.width
      );
      if (upOverY || downOverY || leftOverX || rightOverX) {
        let offParts =
          Math.max(upOverY, downOverY, leftOverX, rightOverX) /
          scaleState.fcellSize;
        if (offParts >= ship.type) {
          state.invalidParts = [..._.range(ship?.type)];
        } else {
          let [curPart, inc] = (
            ship.rotation == "top"
              ? upOverY
              : ship.rotation == "left"
              ? leftOverX
              : rightOverX || downOverY
          )
            ? [-1, 1]
            : [ship.type, -1];
          while (offParts > 0) {
            state.invalidParts.push((curPart += inc));
            offParts--;
          }
        }
      }
    }
    if (state.invalidParts.length < ship.type) {
      const fcellSz = scaleState.fcellSize;
      let sx = x + (ship.rotation == "right" ? (ship.type - 1) * fcellSz : 0);
      let sy = y + (ship.rotation == "down" ? (ship.type - 1) * fcellSz : 0);
      const startSxCells = sx / fcellSz;
      const startSyCells = sy / fcellSz;
      const [dx, dy] = SHIP_DIRECTION_INCREMENTS[ship.rotation];
      for (let i = 0; i < ship.type; i++) {
        const sxCells = sx / fcellSz;
        const syCells = sy / fcellSz;
        if (!state.invalidParts.includes(i)) {
          const xs = [];
          const ys = [];
          if (sxCells % 1 > 0.15) {
            xs.push(Math.ceil(sxCells));
          }
          if (sxCells % 1 < 0.85) {
            xs.push(Math.floor(sxCells));
          }
          if (syCells % 1 > 0.15) {
            ys.push(Math.ceil(syCells));
          }
          if (syCells % 1 < 0.85) {
            ys.push(Math.floor(syCells));
          }

          check: for (let xx of xs) {
            for (let yy of ys) {
              if (fieldMap[xx]?.[yy]) {
                state.invalidParts.push(i);
                break check;
              }
            }
          }
        }
        sx += dx * fcellSz;
        sy += dy * fcellSz;
      }

      if (state.invalidParts.length == 0 && fieldState.shipPlaceholder) {
        fieldState.shipPlaceholder.rotation = ship.rotation;
        fieldState.shipPlaceholder.x = Math.min(
          Math.round(startSxCells),
          9
        ) as Coord;
        fieldState.shipPlaceholder.y = Math.min(
          Math.round(startSyCells),
          9
        ) as Coord;
      }
    }
  });

  return state;
}
