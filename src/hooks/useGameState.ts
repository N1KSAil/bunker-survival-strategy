import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";

export const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetGameState = () => {
    setGameStarted(false);
    setCurrentLobby(null);
    setPlayers([]);
    setIsLoading(false);
  };

  return {
    gameStarted,
    setGameStarted,
    players,
    setPlayers,
    currentLobby,
    setCurrentLobby,
    isLoading,
    setIsLoading,
    resetGameState,
  };
};