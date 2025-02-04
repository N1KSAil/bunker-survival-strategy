import { PlayerCharacteristics } from "./game";

export interface LobbyData {
  password: string;
  players: PlayerCharacteristics[];
}

export interface LobbyStorage {
  get(key: string): LobbyData | undefined;
  set(key: string, value: LobbyData): void;
  delete(key: string): void;
  clear(): void;
}