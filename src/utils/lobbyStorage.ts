import { PlayerCharacteristics } from "@/types/game";

export type LobbyData = {
  password: string;
  players: PlayerCharacteristics[];
};

export const getLobbiesFromStorage = (): Map<string, LobbyData> => {
  const lobbiesData = localStorage.getItem('lobbies');
  if (!lobbiesData) return new Map();
  return new Map(JSON.parse(lobbiesData));
};

export const saveLobbiesToStorage = (lobbies: Map<string, LobbyData>) => {
  localStorage.setItem('lobbies', JSON.stringify(Array.from(lobbies.entries())));
};