import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";

// Перемещаем lobbies в глобальную область видимости, чтобы они сохранялись между рендерами
const lobbies = new Map<string, { password: string; players: PlayerCharacteristics[] }>();

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);

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
    
    lobbies.set(name, newLobby);
    console.log("Лобби успешно создано:", name, "с первым игроком:", firstPlayer.name);
    console.log("Текущие лобби:", Array.from(lobbies.keys()));
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