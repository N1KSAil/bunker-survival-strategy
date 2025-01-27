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
    resetGameState
  } = useGameState();

  const {
    lobbies,
    checkLobbyExists,
    checkLobbyPassword,
    createLobby,
    deleteLobby,
    deleteAllLobbies
  } = useLobbyManagement();

  const getCurrentPlayerData = useCallback(() => {
    return players.find(player => player.name === playerName);
  }, [players, playerName]);

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      setIsLoading(true);
      const { name, password } = lobbyCredentials;

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
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndReconnectToLobby = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const { data: participantData, error } = await supabase
        .from('lobby_participants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!participantData) return false;

      const { lobby_name, lobby_password } = participantData;
      const lobby = lobbies.get(lobby_name);

      if (lobby) {
        setCurrentLobby({ name: lobby_name, password: lobby_password });
        setPlayers(lobby.players);
        setGameStarted(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error reconnecting to lobby:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [lobbies, setCurrentLobby, setPlayers, setGameStarted, setIsLoading]);

  return {
    gameStarted,
    players,
    currentLobby,
    isLoading,
    handleStartGame,
    deleteLobby,
    deleteAllLobbies,
    getCurrentPlayerData,
    checkAndReconnectToLobby,
    resetGameState
  };
};