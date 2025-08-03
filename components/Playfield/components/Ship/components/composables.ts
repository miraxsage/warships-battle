import { SHIP_THEMES } from "./constants";
import type { ShipVariantProps } from "./types";

export function useShipVariant(
  theme: ShipVariantProps["theme"],
  variant: 1 | 2 | 3 | 4
) {
  const colors = computed(() => SHIP_THEMES[theme ?? "normal"]);
  const filter = computed(() =>
    theme == "error" || theme == "fire"
      ? "contrast(1.5)"
      : theme == "destroyed"
      ? `drop-shadow(-2px -2px 1px #1d1d1daa) drop-shadow(2px 2px 2px #1d1d1daa) url(#ship-distort-heavy-${variant})`
      : "unset"
  );
  return { colors, filter };
}
