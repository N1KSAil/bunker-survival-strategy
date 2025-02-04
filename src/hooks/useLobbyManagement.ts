import { useState } from "react";
import { LobbyData } from "@/types/lobby";
import { lobbyStorage } from "@/utils/lobbyStorageManager";
import {
  checkLobbyExists,
  checkLobbyPassword,
  createLobby,
  deleteLobby,
  deleteAllLobbies,
  loadLobbiesFromStorage
} from "@/services/lobbyService";

export const useLobbyManagement = () => {
  const [lobbies, setLobbies] = useState<Map<string, LobbyData>>(new Map());

  const updateLobbies = () => {
    setLobbies(lobbyStorage.getAll());
  };

  return {
    lobbies,
    checkLobbyExists,
    checkLobbyPassword,
    createLobby: async (...args: Parameters<typeof createLobby>) => {
      await createLobby(...args);
      updateLobbies();
    },
    deleteLobby: async (...args: Parameters<typeof deleteLobby>) => {
      await deleteLobby(...args);
      updateLobbies();
    },
    deleteAllLobbies: async () => {
      await deleteAllLobbies();
      updateLobbies();
    },
    loadLobbiesFromStorage: async () => {
      const result = await loadLobbiesFromStorage();
      setLobbies(result);
      return result;
    }
  };
};