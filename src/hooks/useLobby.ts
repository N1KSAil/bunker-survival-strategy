import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { useGameState } from "./useGameState";
import { useLobbyManagement } from "./useLobbyManagement";

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const {
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
    resetGameState
  } = useGameState();

  const {
    lobbies,
    checkLobbyExists,
    checkLobbyPassword,
    createLobby,
    deleteLobby,
    deleteAllLobbies,
    loadLobbiesFromStorage
  } = useLobbyManagement();

  const getCurrentPlayerData = useCallback(() => {
    return players.find(player => player.name === playerName);
  }, [players, playerName]);

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      setIsLoading(true);
      const { name, password } = lobbyCredentials;

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error("Пожалуйста, войдите в систему");
        return;
      }

      if (isCreating) {
        const newPlayer = {
          ...initialPlayers[0],
          name: playerName,
          id: 1
        };
        await createLobby(name, password, newPlayer);
        setPlayers([newPlayer]);
      } else {
        if (!checkLobbyExists(name)) {
          toast.error("Лобби не существует");
          return;
        }
        if (!checkLobbyPassword(name, password)) {
          toast.error("Неверный пароль");
          return;
        }

        const lobby = lobbies.get(name);
        if (lobby) {
          const newPlayer = {
            ...initialPlayers[lobby.players.length],
            name: playerName,
            id: lobby.players.length + 1
          };
          lobby.players.push(newPlayer);
          setPlayers(lobby.players);
        }
      }

      setCurrentLobby(lobbyCredentials);
      setGameStarted(true);
      toast.success(isCreating ? "Лобби создано!" : "Вы присоединились к лобби!");
    } catch (error: any) {
      console.error("Game start error:", error);
      toast.error(error.message || "Ошибка при входе в лобби");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndReconnectToLobby = useCallback(async (userId: string) => {
    if (!userId) {
      setIsAuthChecking(false);
      return false;
    }

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const { data: participantData, error } = await supabase
          .from('lobby_participants')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching lobby participant:', error);
          throw error;
        }
        
        if (!participantData) {
          setIsAuthChecking(false);
          return false;
        }

        const { lobby_name, lobby_password } = participantData;
        
        await loadLobbiesFromStorage();
        const lobby = lobbies.get(lobby_name);

        if (lobby) {
          setCurrentLobby({ name: lobby_name, password: lobby_password });
          setPlayers(lobby.players);
          setGameStarted(true);
          setIsAuthChecking(false);
          return true;
        }

        await supabase
          .from('lobby_participants')
          .delete()
          .eq('user_id', userId);

        setIsAuthChecking(false);
        return false;
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount === maxRetries) {
          console.error('Max retries reached');
          toast.error("Не удалось подключиться к лобби. Попробуйте позже.");
          setIsAuthChecking(false);
          return false;
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    setIsAuthChecking(false);
    return false;
  }, [lobbies, setCurrentLobby, setPlayers, setGameStarted, setIsAuthChecking, loadLobbiesFromStorage]);

  return {
    gameStarted,
    players,
    currentLobby,
    isLoading,
    isAuthChecking,
    setIsAuthChecking,
    handleStartGame,
    deleteLobby,
    deleteAllLobbies,
    getCurrentPlayerData,
    checkAndReconnectToLobby,
    resetGameState
  };
};