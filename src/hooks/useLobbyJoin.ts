import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";

export const useLobbyJoin = () => {
  const handleJoinLobby = async (
    name: string,
    password: string,
    userId: string,
    playerName: string,
    initialPlayers: PlayerCharacteristics[]
  ) => {
    // Сначала проверяем существование лобби
    const { data: existingLobby, error: checkError } = await supabase
      .from('lobby_participants')
      .select('*')
      .eq('lobby_name', name)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking lobby:", checkError);
      toast.error("Ошибка при проверке лобби");
      return null;
    }

    if (!existingLobby) {
      toast.error("Лобби не существует");
      return null;
    }

    // Проверяем пароль
    if (existingLobby.lobby_password !== password) {
      toast.error("Неверный пароль");
      return null;
    }

    // Получаем список всех игроков в лобби
    const { data: existingPlayers, error: playersError } = await supabase
      .from('lobby_participants')
      .select('user_id')
      .eq('lobby_name', name);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      toast.error("Ошибка при получении списка игроков");
      return null;
    }

    const newPlayer = {
      ...initialPlayers[existingPlayers.length],
      name: playerName,
      id: existingPlayers.length + 1
    };

    // Добавляем нового игрока в лобби
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
      return null;
    }

    const allPlayers = existingPlayers.map((p, index) => ({
      ...initialPlayers[index],
      id: index + 1,
      name: p.user_id
    }));
    
    allPlayers.push(newPlayer);
    return { players: allPlayers, newPlayer };
  };

  return { handleJoinLobby };
};