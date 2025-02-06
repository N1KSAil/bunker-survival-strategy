import { supabase } from "@/integrations/supabase/client";
import { PlayerCharacteristics } from "@/types/game";
import { toast } from "sonner";

export const useLobbyCreate = () => {
  const handleCreateLobby = async (
    name: string,
    password: string,
    userId: string,
    playerName: string,
    initialPlayers: PlayerCharacteristics[]
  ) => {
    try {
      // First, check if user is already in a lobby
      const { data: existingParticipation, error: participationError } = await supabase
        .from('lobby_participants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (participationError) {
        console.error("Error checking user participation:", participationError);
        toast.error("Ошибка при проверке участия в лобби");
        return null;
      }

      // If user is already in a lobby, remove them first
      if (existingParticipation) {
        const { error: deleteError } = await supabase
          .from('lobby_participants')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error("Error removing from previous lobby:", deleteError);
          toast.error("Ошибка при выходе из предыдущего лобби");
          return null;
        }
      }

      // Check if lobby exists
      const { data: existingLobby, error: checkError } = await supabase
        .from('lobby_participants')
        .select('lobby_name')
        .eq('lobby_name', name)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking lobby existence:", checkError);
        toast.error("Ошибка при проверке существования лобби");
        return null;
      }

      if (existingLobby) {
        toast.error("Лобби с таким названием уже существует");
        return null;
      }

      // Create the lobby by inserting the first participant (creator)
      const { error: createError } = await supabase
        .from('lobby_participants')
        .insert({
          user_id: userId,
          lobby_name: name,
          lobby_password: password,
        });

      if (createError) {
        console.error("Error creating lobby:", createError);
        toast.error("Ошибка при создании лобби");
        return null;
      }

      // After successful creation, prepare player data with all characteristics
      const newPlayer: PlayerCharacteristics = {
        ...initialPlayers[0],
        id: 1,
        name: playerName,
        profession: initialPlayers[0].profession,
        professionExperience: initialPlayers[0].professionExperience,
        gender: initialPlayers[0].gender,
        health: initialPlayers[0].health,
        hobby: initialPlayers[0].hobby,
        hobbyExperience: initialPlayers[0].hobbyExperience,
        phobia: initialPlayers[0].phobia,
        bagItem: initialPlayers[0].bagItem,
        specialAbility: initialPlayers[0].specialAbility,
        additionalTraits: initialPlayers[0].additionalTraits,
        onlineStatus: true,
        age: initialPlayers[0].age,
        education: initialPlayers[0].education
      };

      toast.success("Лобби успешно создано!");
      return { players: [newPlayer], newPlayer };
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Произошла неожиданная ошибка");
      return null;
    }
  };

  return { handleCreateLobby };
};