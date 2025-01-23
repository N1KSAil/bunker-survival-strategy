import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";

// Глобальное хранилище лобби
const lobbies = new Map<string, { password: string; players: PlayerCharacteristics[] }>();

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);

  const checkLobbyExists = async (name: string, password: string) => {
    console.log("Checking lobby:", name);
    console.log("Available lobbies:", Array.from(lobbies.keys()));
    
    const lobby = lobbies.get(name);
    if (!lobby) {
      throw new Error("Лобби не существует");
    }
    if (lobby.password !== password) {
      throw new Error("Неверный пароль");
    }
    return lobby;
  };

  const createLobby = async (name: string, password: string, initialPlayers: PlayerCharacteristics[]) => {
    console.log("Creating lobby:", name);
    if (lobbies.has(name)) {
      throw new Error("Лобби с таким названием уже существует");
    }
    const newLobby = { password, players: initialPlayers };
    lobbies.set(name, newLobby);
    console.log("Lobby created successfully");
    return newLobby;
  };

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    if (!playerName.trim()) {
      toast.error("Пожалуйста, введите имя персонажа");
      return;
    }

    try {
      if (isCreating) {
        // При создании лобби первый игрок получает первый набор характеристик
        const firstPlayer = {
          ...initialPlayers[0],
          name: playerName
        };
        
        const newLobby = await createLobby(
          lobbyCredentials.name,
          lobbyCredentials.password,
          [firstPlayer]
        );
        
        setGameStarted(true);
        setCurrentLobby(lobbyCredentials);
        setPlayers(newLobby.players);
        toast.success(`Лобби ${lobbyCredentials.name} создано! Характеристики розданы.`);
      } else {
        const lobby = await checkLobbyExists(lobbyCredentials.name, lobbyCredentials.password);
        
        // При присоединении к лобби игрок получает следующий доступный набор характеристик
        const nextCharacteristics = initialPlayers[lobby.players.length % initialPlayers.length];
        const newPlayer = {
          ...nextCharacteristics,
          name: playerName
        };

        const updatedPlayers = [...lobby.players, newPlayer];
        lobbies.set(lobbyCredentials.name, {
          password: lobbyCredentials.password,
          players: updatedPlayers,
        });

        setGameStarted(true);
        setCurrentLobby(lobbyCredentials);
        setPlayers(updatedPlayers);
        toast.success(`Вы присоединились к лобби ${lobbyCredentials.name}!`);
      }
    } catch (error) {
      console.error("Error in handleStartGame:", error);
      toast.error((error as Error).message);
    }
  };

  return {
    gameStarted,
    players,
    currentLobby,
    handleStartGame,
    getCurrentPlayerData: () => players.find(player => player.name === playerName),
  };
};