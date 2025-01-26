import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";

export const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);

  const resetGameState = () => {
    setGameStarted(false);
    setCurrentLobby(null);
    setPlayers([]);
  };

  return {
    gameStarted,
    setGameStarted,
    players,
    setPlayers,
    currentLobby,
    setCurrentLobby,
    resetGameState,
  };
};