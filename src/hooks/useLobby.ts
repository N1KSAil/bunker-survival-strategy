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

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        toast.error("Пожалуйста, войдите в систему");
        return;
      }

      const userId = sessionData.session.user.id;

      if (isCreating) {
        const newPlayer = {
          ...initialPlayers[0],
          name: playerName,
          id: 1
        };

        // Create new lobby in Supabase
        const { error: createError } = await supabase
          .from('lobby_participants')
          .insert({
            user_id: userId,
            lobby_name: name,
            lobby_password: password
          });

        if (createError) {
          console.error("Error creating lobby:", createError);
          toast.error("Ошибка при создании лобби");
          return;
        }

        setPlayers([newPlayer]);
      } else {
        // Check if lobby exists and verify password
        const { data: lobbyData, error: lobbyError } = await supabase
          .from('lobby_participants')
          .select('lobby_password')
          .eq('lobby_name', name)
          .single();

        if (lobbyError) {
          console.error("Error checking lobby:", lobbyError);
          toast.error("Лобби не существует");
          return;
        }

        if (lobbyData.lobby_password !== password) {
          toast.error("Неверный пароль");
          return;
        }

        // Get existing players in the lobby
        const { data: existingPlayers, error: playersError } = await supabase
          .from('lobby_participants')
          .select('user_id')
          .eq('lobby_name', name);

        if (playersError) {
          console.error("Error fetching players:", playersError);
          toast.error("Ошибка при получении списка игроков");
          return;
        }

        const newPlayer = {
          ...initialPlayers[existingPlayers.length],
          name: playerName,
          id: existingPlayers.length + 1
        };

        // Add new player to lobby
        const { error: joinError } = await supabase
          .from('lobby_participants')
          .insert({
            user_id: userId,
            lobby_name: name,
            lobby_password: password
          });

        if (joinError) {
          console.error("Error joining lobby:", joinError);
          toast.error("Ошибка при присоединении к лобби");
          return;
        }

        const allPlayers = existingPlayers.map((p, index) => ({
          ...initialPlayers[index],
          id: index + 1,
          name: p.user_id
        }));
        
        allPlayers.push(newPlayer);
        setPlayers(allPlayers);
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