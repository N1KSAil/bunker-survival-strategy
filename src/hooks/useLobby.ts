import { useState, useEffect } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";

// Функции для работы с localStorage
const getLobbiesFromStorage = (): Map<string, { password: string; players: PlayerCharacteristics[] }> => {
  const lobbiesData = localStorage.getItem('lobbies');
  if (!lobbiesData) return new Map();
  return new Map(JSON.parse(lobbiesData));
};

const saveLobbiesToStorage = (lobbies: Map<string, { password: string; players: PlayerCharacteristics[] }>) => {
  localStorage.setItem('lobbies', JSON.stringify(Array.from(lobbies.entries())));
};

const getCurrentSessionFromStorage = () => {
  const session = localStorage.getItem('currentSession');
  if (!session) return null;
  return JSON.parse(session);
};

const saveCurrentSessionToStorage = (playerName: string, lobbyCredentials: LobbyCredentials | null) => {
  if (lobbyCredentials) {
    localStorage.setItem('currentSession', JSON.stringify({ playerName, lobbyCredentials }));
  } else {
    localStorage.removeItem('currentSession');
  }
};

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);
  const [lobbies, setLobbies] = useState<Map<string, { password: string; players: PlayerCharacteristics[] }>>(
    getLobbiesFromStorage()
  );

  // Восстановление сессии при загрузке
  useEffect(() => {
    const session = getCurrentSessionFromStorage();
    if (session && playerName && !gameStarted) {
      handleStartGame(session.lobbyCredentials, false);
    }
  }, [playerName, gameStarted]);

  // Сохранение лобби
  useEffect(() => {
    saveLobbiesToStorage(lobbies);
  }, [lobbies]);

  // Сохранение текущей сессии
  useEffect(() => {
    if (playerName) {
      saveCurrentSessionToStorage(playerName, currentLobby);
    }
  }, [playerName, currentLobby]);

  const checkLobbyExists = async (name: string, password: string) => {
    console.log("Проверяем лобби:", name);
    console.log("Доступные лобби:", Array.from(lobbies.keys()));
    
    const lobby = lobbies.get(name);
    if (!lobby) {
      console.log("Лобби не найдено:", name);
      throw new Error("Лобби не существует");
    }
    
    if (lobby.password !== password) {
      throw new Error("Неверный пароль");
    }
    
    console.log("Лобби найдено:", name, "с игроками:", lobby.players);
    return lobby;
  };

  const createLobby = async (name: string, password: string, firstPlayer: PlayerCharacteristics) => {
    console.log("Создаем новое лобби:", name);
    
    if (lobbies.has(name)) {
      console.log("Лобби уже существует:", name);
      throw new Error("Лобби с таким названием уже существует");
    }
    
    const newLobby = { 
      password, 
      players: [firstPlayer] 
    };
    
    const updatedLobbies = new Map(lobbies);
    updatedLobbies.set(name, newLobby);
    setLobbies(updatedLobbies);
    
    console.log("Лобби успешно создано:", name, "с первым игроком:", firstPlayer.name);
    console.log("Текущие лобби:", Array.from(updatedLobbies.keys()));
    return newLobby;
  };

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      if (!playerName.trim()) {
        toast.error("Пожалуйста, введите имя персонажа");
        return;
      }

      if (isCreating) {
        console.log("Создаем новое лобби:", lobbyCredentials.name);
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
        console.log("Присоединяемся к существующему лобби:", lobbyCredentials.name);
        const lobby = await checkLobbyExists(lobbyCredentials.name, lobbyCredentials.password);
        
        // Проверяем, есть ли уже игрок с таким именем в лобби
        const existingPlayer = lobby.players.find(player => player.name === playerName);
        if (existingPlayer) {
          // Если игрок уже есть, просто переподключаем его
          setGameStarted(true);
          setCurrentLobby(lobbyCredentials);
          setPlayers(lobby.players);
          toast.success(`Вы переподключились к лобби ${lobbyCredentials.name}!`);
          return;
        }

        // Если это новый игрок
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

        console.log("Успешно присоединились к лобби. Обновленные игроки:", updatedPlayers);
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
    getCurrentPlayerData: () => players.find(player => player.name === playerName),
  };
};