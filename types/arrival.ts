import { Player } from "./player";

export type Arrival = {
  id: string;
  arrival_order: number;
  created_at: string;

  player: Player;
};