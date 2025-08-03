import { TURN_ANIMATION_DURATION } from "~/constants/common";
import * as _ from "lodash-es";

export function useShip(shipId: string, owner: "player" | "enemy") {
  const fieldState = useFieldStore();
  const gameState = useGameStore();
  const shipFieldState =
    owner == "player" ? fieldState.player : fieldState.enemy;
  const ship = shipFieldState.ships.find(({ id }) => id == shipId);
  if (!ship) return;

  const damagedParts = ref<number[]>([]);
  const isDestroyed = ref(false);
  watchEffect(() => {
    let isLastTurnDamaged = false;
    const shipTurnsMap =
      owner == "player"
        ? fieldState.enemy.turnsMap
        : fieldState.player.turnsMap;
    const newDamagedParts: number[] = [];
    forEachShipPart(ship, ({ part, x, y }) => {
      if (!!shipTurnsMap[x]?.[y]?.count) {
        newDamagedParts.push(part);
        if (gameState.lastTurn?.x == x && gameState.lastTurn?.y == y) {
          isLastTurnDamaged = true;
        }
      }
    });
    if (isLastTurnDamaged) {
      setTimeout(
        () => (damagedParts.value = newDamagedParts),
        TURN_ANIMATION_DURATION * 1.1
      );
      if (newDamagedParts.length == ship.type) {
        setTimeout(
          () => (isDestroyed.value = true),
          TURN_ANIMATION_DURATION * 2
        );
      }
    } else {
      damagedParts.value = newDamagedParts;
      isDestroyed.value = newDamagedParts.length == ship.type;
    }
  });
  const isDamaged = computed(() => damagedParts.value.length > 0);
  return { ship, damagedParts, isDestroyed, isDamaged };
}
