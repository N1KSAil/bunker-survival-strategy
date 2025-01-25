import { useState, useEffect } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";

const getLobbiesFromStorage = (): Map<string, { password: string; players: PlayerCharacteristics[] }> => {
  const lobbiesData = localStorage.getItem('lobbies');
  if (!lobbiesData) return new Map();
  return new Map(JSON.parse(lobbiesData));
};

const saveLobbiesToStorage = (lobbies: Map<string, { password: string; players: PlayerCharacteristics[] }>) => {
  localStorage.setItem('lobbies', JSON.stringify(Array.from(lobbies.entries())));
};

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);
  const [lobbies, setLobbies] = useState<Map<string, { password: string; players: PlayerCharacteristics[] }>>(
    getLobbiesFromStorage()
  );

  useEffect(() => {
    saveLobbiesToStorage(lobbies);
  }, [lobbies]);

  const checkLobbyExists = async (name: string, password: string) => {
    const lobby = lobbies.get(name);
    if (!lobby) {
      throw new Error("Лобби не существует");
    }
    
    if (lobby.password !== password) {
      throw new Error("Неверный пароль");
    }
    
    return lobby;
  };

  const createLobby = async (name: string, password: string, firstPlayer: PlayerCharacteristics) => {
    if (lobbies.has(name)) {
      throw new Error("Лобби с таким названием уже существует");
    }
    
    const newLobby = { 
      password, 
      players: [firstPlayer] 
    };
    
    const updatedLobbies = new Map(lobbies);
    updatedLobbies.set(name, newLobby);
    setLobbies(updatedLobbies);
    
    return newLobby;
  };

  const deleteLobby = (name: string, password: string) => {
    const lobby = lobbies.get(name);
    if (!lobby) {
      throw new Error("Лобби не существует");
    }
    
    if (lobby.password !== password) {
      throw new Error("Неверный пароль");
    }

    const updatedLobbies = new Map(lobbies);
    updatedLobbies.delete(name);
    setLobbies(updatedLobbies);
    
    if (currentLobby?.name === name) {
      setGameStarted(false);
      setCurrentLobby(null);
      setPlayers([]);
    }
    
    toast.success(`Лобби ${name} удалено`);
  };

  const deleteAllLobbies = () => {
    localStorage.removeItem('lobbies');
    setLobbies(new Map());
    setGameStarted(false);
    setCurrentLobby(null);
    setPlayers([]);
    toast.success('Все лобби удалены');
  };

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      if (!playerName.trim()) {
        toast.error("Пожалуйста, введите имя персонажа");
        return;
      }

      if (isCreating) {
        // Check if lobby exists before attempting to create
        if (lobbies.has(lobbyCredentials.name)) {
          toast.error("Лобби с таким названием уже существует");
          return;
        }

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
        const lobby = await checkLobbyExists(lobbyCredentials.name, lobbyCredentials.password);
        
        if (lobby.players.some(player => player.name === playerName)) {
          toast.error("Игрок с таким именем уже присоединился к лобби");
          return;
        }

        const nextCharacteristics = initialPlayers[lobby.players.length % initialPlayers.length];
        const newPlayer = {
          ...nextCharacteristics,
          name: playerName,
        };

        const updatedPlayers = [...lobby.players, newPlayer];
        const updatedLobbies = new Map(lobbies);
        updatedLobbies.set(lobbyCredentials.name, {
          password: lobbyCredentials.password,
          players: updatedPlayers,
        });
        setLobbies(updatedLobbies);

        setGameStarted(true);
        setCurrentLobby(lobbyCredentials);
        setPlayers(updatedPlayers);
        toast.success(`Вы присоединились к лобби ${lobbyCredentials.name}!`);
      }
    } catch (error) {
      console.error("Ошибка в handleStartGame:", error);
      toast.error((error as Error).message);
    }
  };

  return {
    gameStarted,
    players,
    currentLobby,
    handleStartGame,
    deleteLobby,
    deleteAllLobbies,
    getCurrentPlayerData: () => players.find(player => player.name === playerName),
  };
};