import type { InjectionKey } from "vue";

export type SizeContext = {
  cellSize: number;
  verticalCells: number;
  verticalCenter: number;
  horizontalCells: number;
  horizontalCenter: number;
};

export const sizeContextKey = Symbol() as InjectionKey<SizeContext | null>;
