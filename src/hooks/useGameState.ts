import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";

export const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Начинаем с true

  const resetGameState = () => {
    setGameStarted(false);
    setCurrentLobby(null);
    setPlayers([]);
    setIsLoading(false);
    setIsAuthChecking(false); // Важно сбросить это состояние при сбросе
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
    isAuthChecking,
    setIsAuthChecking,
    resetGameState,
  };
};