import type { ShallowRef } from "vue";
import type { PlayfieldState } from "~/components/Playfield/types";
import { fieldStateContextKey } from "~/components/Playfield/utils";
import { sizeContextKey } from "~/layouts/utils";
import type { Rotation } from "../types";
import * as _ from "lodash-es";

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

function getFieldMap(fieldState: PlayfieldState, withoutShipId: string) {
  const map: string[][] = [];
  for (let ship of fieldState.ships) {
    if (ship.id == withoutShipId) {
      continue;
    }
    (map[ship.x] || (map[ship.x] = []))[ship.y] = ship.id;
    const [dx, dy] = SHIP_DIRECTION_INCREMENTS[ship.rotation];
    for (let i = 1; i < ship.type; i++) {
      (map[ship.x + dx] || (map[ship.x + dx] = []))[ship.y + dy] = ship.id;
    }
  }
  return map;
}

export function useShipCoordination<T extends HTMLElement>(
  el: ShallowRef<T | null>,
  { shipId, coords }: UseCoordinationOptions
) {
  const fieldState = inject(fieldStateContextKey);
  const sizeState = inject(sizeContextKey);

  const state = reactive({
    invalidParts: [] as number[],
    closestValidCoords: [] as number[],
  });

  watch([coords, fieldState], () => {
    if (!fieldState?.ships.find(({ id }) => id == shipId)?.isDragging) {
      return;
    }
    const fieldMap = fieldState && getFieldMap(fieldState, shipId);

    const actualCoords = el.value && el.value.getBoundingClientRect();
    const ship = _.find(fieldState?.ships, { id: shipId });

    if (!actualCoords || !fieldState || !ship || !sizeState || !fieldMap) {
      return;
    }

    const x = actualCoords.left - fieldState.fieldCoords.left;
    const y = actualCoords.top - fieldState.fieldCoords.top;
    state.invalidParts = [];
    const isVertical = !!ship.rotation.match(/top|down/);
    const isHorizontal = !!ship.rotation.match(/left|right/);
    if (
      (isVertical &&
        (x < 0 || x + sizeState.fcellSize > fieldState.fieldCoords.width)) ||
      (isHorizontal &&
        (y < 0 || y + sizeState.fcellSize > fieldState.fieldCoords.height))
    ) {
      state.invalidParts = [..._.range(ship?.type)];
    } else {
      const upOverY = Math.max(0, -y);
      const downOverY = Math.max(
        0,
        !isVertical
          ? 0
          : y + ship.type * sizeState.fcellSize - fieldState.fieldCoords.height
      );
      const leftOverX = Math.max(0, -x);
      const rightOverX = Math.max(
        0,
        !isHorizontal
          ? 0
          : x + ship.type * sizeState.fcellSize - fieldState.fieldCoords.width
      );
      if (upOverY || downOverY || leftOverX || rightOverX) {
        let offParts =
          Math.max(upOverY, downOverY, leftOverX, rightOverX) /
          sizeState.fcellSize;
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
      const fcellSz = sizeState.fcellSize;
      let sx = x + (ship.rotation == "right" ? (ship.type - 1) * fcellSz : 0);
      let sy = y + (ship.rotation == "down" ? (ship.type - 1) * fcellSz : 0);
      const [dx, dy] = SHIP_DIRECTION_INCREMENTS[ship.rotation];
      for (let i = 0; i < ship.type; i++) {
        if (!state.invalidParts.includes(i)) {
          const sxCells = sx / fcellSz;
          const syCells = sy / fcellSz;
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
    }
  });

  return state;
}
