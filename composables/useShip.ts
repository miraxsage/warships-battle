export function useShip(shipId: string) {
  const { player: fieldState } = useFieldStore();
  return fieldState?.ships.find(({ id }) => id == shipId);
}
