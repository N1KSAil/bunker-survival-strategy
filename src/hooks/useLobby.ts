import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";

const lobbies = new Map<string, { password: string; players: PlayerCharacteristics[] }>();

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);

  const checkLobbyExists = async (name: string, password: string) => {
    const lobby = lobbies.get(name);
    
    if (!lobby) {
      console.log("Lobby not found:", name);
      console.log("Available lobbies:", Array.from(lobbies.keys()));
      throw new Error("Лобби не существует");
    }
    
    if (lobby.password !== password) {
      throw new Error("Неверный пароль");
    }
    
    console.log("Lobby found:", name, "with players:", lobby.players.length);
    return lobby;
  };

  const createLobby = async (name: string, password: string, firstPlayer: PlayerCharacteristics) => {
    if (lobbies.has(name)) {
      console.log("Lobby already exists:", name);
      throw new Error("Лобби с таким названием уже существует");
    }
    
    const newLobby = { 
      password, 
      players: [firstPlayer] 
    };
    
    lobbies.set(name, newLobby);
    console.log("Created new lobby:", name, "with first player:", firstPlayer.name);
    return newLobby;
  };

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      if (!playerName.trim()) {
        toast.error("Пожалуйста, введите имя персонажа");
        return;
      }

      if (isCreating) {
        console.log("Creating new lobby:", lobbyCredentials.name);
        const firstPlayer = {
          ...initialPlayers[0],
          name: playerName,
        };
        
        const newLobby = await createLobby(
          lobbyCredentials.name,
          lobbyCredentials.password,
          firstPlayer
        );
        
        setGameStarted(true);
        setCurrentLobby(lobbyCredentials);
        setPlayers(newLobby.players);
        toast.success(`Лобби ${lobbyCredentials.name} создано!`);
      } else {
        console.log("Joining existing lobby:", lobbyCredentials.name);
        const lobby = await checkLobbyExists(lobbyCredentials.name, lobbyCredentials.password);
        
        // Проверяем, не присоединился ли уже игрок с таким именем
        if (lobby.players.some(player => player.name === playerName)) {
          throw new Error("Игрок с таким именем уже присоединился к лобби");
        }

        const nextCharacteristics = initialPlayers[lobby.players.length % initialPlayers.length];
        const newPlayer = {
          ...nextCharacteristics,
          name: playerName,
        };

        const updatedPlayers = [...lobby.players, newPlayer];
        lobbies.set(lobbyCredentials.name, {
          password: lobbyCredentials.password,
          players: updatedPlayers,
        });

        console.log("Successfully joined lobby. Updated players:", updatedPlayers);
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