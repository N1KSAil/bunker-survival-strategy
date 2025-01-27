import { PlayerCharacteristics } from "@/types/game";

export type LobbyData = {
  password: string;
  players: PlayerCharacteristics[];
};

export const getLobbiesFromStorage = (): Map<string, LobbyData> => {
  try {
    const lobbiesData = localStorage.getItem('lobbies');
    if (!lobbiesData) return new Map();
    return new Map(JSON.parse(lobbiesData));
  } catch (error) {
    console.error('Error reading lobbies from storage:', error);
    return new Map();
  }
};

export const saveLobbiesToStorage = (lobbies: Map<string, LobbyData>) => {
  try {
    localStorage.setItem('lobbies', JSON.stringify(Array.from(lobbies.entries())));
  } catch (error) {
    console.error('Error saving lobbies to storage:', error);
  }
};

export const clearLobbiesFromStorage = () => {
  try {
    localStorage.removeItem('lobbies');
  } catch (error) {
    console.error('Error clearing lobbies from storage:', error);
  }
};