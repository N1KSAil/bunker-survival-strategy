
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
      console.error("Error creating lobby:", createError);
      toast.error("Ошибка при создании лобби");
      return null;
    }

    return { players: [newPlayer], newPlayer };
  };

  return { handleCreateLobby };
};
