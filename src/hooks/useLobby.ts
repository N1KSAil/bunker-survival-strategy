
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { useGameState } from "./useGameState";
import { useLobbyManagement } from "./useLobbyManagement";
import { useLobbyJoin } from "./useLobbyJoin";
import { useLobbyCreate } from "./useLobbyCreate";
import { useLobbyRealtime } from "./useLobbyRealtime";

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
    deleteLobby,
    deleteAllLobbies,
    loadLobbiesFromStorage
  } = useLobbyManagement();

  const { handleJoinLobby } = useLobbyJoin();
  const { handleCreateLobby } = useLobbyCreate();

  // Подключаем реалтайм обновления
  useLobbyRealtime(currentLobby?.name ?? null, initialPlayers, setPlayers);

  const getCurrentPlayerData = useCallback(() => {
    return players.find(player => player.name === playerName);
  }, [players, playerName]);

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      setIsLoading(true);
      const { name, password } = lobbyCredentials;

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        toast.error("Пожалуйста, войдите в систему");
        return;
      }

      const userId = sessionData.session.user.id;

      let result;
      if (isCreating) {
        result = await handleCreateLobby(name, password, userId, playerName, initialPlayers);
      } else {
        result = await handleJoinLobby(name, password, userId, playerName, initialPlayers);
      }

      if (result) {
        setPlayers(result.players);
        setCurrentLobby(lobbyCredentials);
        setGameStarted(true);
        toast.success(isCreating ? "Лобби создано!" : "Вы присоединились к лобби!");
      }
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
