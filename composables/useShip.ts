import { fieldStateContextKey } from "~/components/Playfield/utils";

export function useShip(shipId: string) {
  const fieldState = inject(fieldStateContextKey);
  return fieldState?.ships.find(({ id }) => id == shipId);
}
