import { useCallback } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLobbyManagement } from "./useLobbyManagement";
import { useGameState } from "./useGameState";

export const useLobby = (playerName: string, initialPlayers: PlayerCharacteristics[]) => {
  const {
    lobbies,
    checkLobbyExists,
    checkLobbyPassword,
    createLobby,
    deleteLobby,
    deleteAllLobbies,
  } = useLobbyManagement();

  const {
    gameStarted,
    setGameStarted,
    players,
    setPlayers,
    currentLobby,
    setCurrentLobby,
    resetGameState,
  } = useGameState();

  const checkAndReconnectToLobby = useCallback(async (userId: string) => {
    try {
      const { data: participation } = await supabase
        .from('lobby_participants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

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
  }, [lobbies, setGameStarted, setCurrentLobby, setPlayers]);

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    try {
      if (!playerName.trim()) {
        toast.error("Пожалуйста, введите имя персонажа");
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Необходимо авторизоваться");
        return;
      }

      if (isCreating) {
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

        const { error: joinError } = await supabase
          .from('lobby_participants')
          .insert({
            user_id: user.id,
            lobby_name: lobbyCredentials.name,
            lobby_password: lobbyCredentials.password
          });

        if (joinError) {
          if (joinError.code === '23505') {
            toast.error("Вы уже присоединены к лобби");
          } else {
            console.error("Error joining lobby:", joinError);
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
    deleteLobby: async (name: string, password: string) => {
      const result = await deleteLobby(name, password);
      if (result && currentLobby?.name === name) {
        resetGameState();
      }
    },
    deleteAllLobbies: async () => {
      const result = await deleteAllLobbies();
      if (result) {
        resetGameState();
      }
    },
    getCurrentPlayerData: () => players.find(player => player.name === playerName),
    checkAndReconnectToLobby
  };
};