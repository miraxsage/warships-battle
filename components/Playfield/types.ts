import type { ShipProps } from "../Ship/types";

export type PlayfieldState = (ShipProps & { id: string })[];
