import { useState, useEffect, useCallback } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const checkLobbyExists = (name: string): boolean => {
    return lobbies.has(name);
  };

  const checkLobbyPassword = (name: string, password: string): boolean => {
    const lobby = lobbies.get(name);
    return lobby?.password === password;
  };

  const checkAndReconnectToLobby = useCallback(async (userId: string) => {
    try {
      const { data: participation, error } = await supabase
        .from('lobby_participants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking lobby participation:", error);
        return false;
      }

      if (participation) {
        const lobby = lobbies.get(participation.lobby_name);
        if (lobby) {
          setGameStarted(true);
          setCurrentLobby({
            name: participation.lobby_name,
            password: participation.lobby_password
          });
          setPlayers(lobby.players);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error in checkAndReconnectToLobby:", error);
      return false;
    }
  }, [lobbies]);

  const createLobby = async (name: string, password: string, firstPlayer: PlayerCharacteristics) => {
    if (checkLobbyExists(name)) {
      throw new Error("Лобби с таким названием уже существует");
    }
    
    const { error } = await supabase
      .from('lobby_participants')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        lobby_name: name,
        lobby_password: password
      });

    if (error) {
      console.error("Error creating lobby participation:", error);
      throw new Error("Ошибка при создании лобби");
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

  const deleteLobby = async (name: string, password: string) => {
    if (!checkLobbyExists(name)) {
      throw new Error("Лобби не существует");
    }
    
    if (!checkLobbyPassword(name, password)) {
      throw new Error("Неверный пароль");
    }

    const { error } = await supabase
      .from('lobby_participants')
      .delete()
      .eq('lobby_name', name);

    if (error) {
      console.error("Error deleting lobby participation:", error);
      throw new Error("Ошибка при удалении лобби");
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

  const deleteAllLobbies = async () => {
    try {
      const { error } = await supabase
        .from('lobby_participants')
        .delete()
        .not('id', 'is', null); // Delete all records instead of using user_id condition

      if (error) {
        console.error("Error deleting all lobbies:", error);
        throw new Error("Ошибка при удалении всех лобби");
      }

      localStorage.removeItem('lobbies');
      setLobbies(new Map());
      setGameStarted(false);
      setCurrentLobby(null);
      setPlayers([]);
      toast.success('Все лобби удалены');
    } catch (error) {
      console.error("Error in deleteAllLobbies:", error);
      throw new Error("Ошибка при удалении всех лобби");
    }
  };

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      if (!playerName.trim()) {
        toast.error("Пожалуйста, введите имя персонажа");
        return;
      }

      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error("Необходимо авторизоваться");
        return;
      }

      if (isCreating) {
        if (checkLobbyExists(lobbyCredentials.name)) {
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
        if (!checkLobbyExists(lobbyCredentials.name)) {
          toast.error("Лобби не существует");
          return;
        }

        if (!checkLobbyPassword(lobbyCredentials.name, lobbyCredentials.password)) {
          toast.error("Неверный пароль");
          return;
        }

        const { error } = await supabase
          .from('lobby_participants')
          .insert({
            user_id: user.data.user.id,
            lobby_name: lobbyCredentials.name,
            lobby_password: lobbyCredentials.password
          });

        if (error) {
          if (error.code === '23505') { // Unique violation
            toast.error("Вы уже присоединены к лобби");
          } else {
            console.error("Error joining lobby:", error);
            toast.error("Ошибка при присоединении к лобби");
          }
          return;
        }

        const lobby = lobbies.get(lobbyCredentials.name);
        
        if (!lobby) {
          toast.error("Ошибка при получении данных лобби");
          return;
        }

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
    checkAndReconnectToLobby
  };
};