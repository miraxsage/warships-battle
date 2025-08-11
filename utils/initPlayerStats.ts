import type { PlayerStats } from "~/types/game";

export function initPlayerStats(value?: PlayerStats): PlayerStats {
  return (
    value || {
      turns: 0,
      hits: 0,
      misses: 0,
      skipped: 0,
    }
  );
}
