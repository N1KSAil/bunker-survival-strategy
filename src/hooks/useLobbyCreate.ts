import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlayerCharacteristics } from "@/types/game";

export const useLobbyCreate = () => {
  const handleCreateLobby = async (
    name: string,
    password: string,
    userId: string,
    playerName: string,
    initialPlayers: PlayerCharacteristics[]
  ) => {
    try {
      // Проверяем существование лобби
      const { data: existingLobby, error: checkError } = await supabase
        .from('lobby_participants')
        .select('lobby_name')
        .eq('lobby_name', name)
        .maybeSingle();

      if (checkError) {
        console.error("Ошибка при проверке лобби:", checkError);
        toast.error("Ошибка при проверке существования лобби");
        return null;
      }

      if (existingLobby) {
        toast.error("Лобби с таким названием уже существует");
        return null;
      }

      const newPlayer = {
        ...initialPlayers[0],
        name: playerName,
        id: 1
      };

      const { error: createError } = await supabase
        .from('lobby_participants')
        .insert({
          user_id: userId,
          lobby_name: name,
          lobby_password: password
        });

      if (createError) {
        console.error("Ошибка при создании лобби:", createError);
        toast.error("Ошибка при создании лобби");
        return null;
      }

      return { players: [newPlayer], newPlayer };
    } catch (error) {
      console.error("Неожиданная ошибка:", error);
      toast.error("Произошла неожиданная ошибка");
      return null;
    }
  };

  return { handleCreateLobby };
};