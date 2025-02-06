import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayerCharacteristics } from "@/types/game";
import { toast } from "sonner";

export const useLobbyRealtime = (
  lobbyName: string | null,
  initialPlayers: PlayerCharacteristics[],
  setPlayers: (players: PlayerCharacteristics[]) => void
) => {
  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    if (!lobbyName) return;

    const channel = supabase
      .channel('lobby_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lobby_participants',
          filter: `lobby_name=eq.${lobbyName}`
        },
        async (payload) => {
          console.log('Получено изменение в лобби:', payload);

          const { data: participants, error } = await supabase
            .from('lobby_participants')
            .select('user_id')
            .eq('lobby_name', lobbyName)
            .order('joined_at', { ascending: true });

          if (error) {
            console.error('Ошибка при получении участников:', error);
            setIsDisconnected(true);
            return;
          }

          const updatedPlayers = participants.map((p, index) => ({
            ...initialPlayers[index],
            id: index + 1,
            name: p.user_id
          }));

          setPlayers(updatedPlayers);
          setIsDisconnected(false);

          if (payload.eventType === 'INSERT') {
            toast.success(`Игрок ${payload.new.user_id} присоединился к лобби!`);
          } else if (payload.eventType === 'DELETE') {
            toast.error(`Игрок ${payload.old.user_id} покинул лобби`);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsDisconnected(false);
        } else {
          setIsDisconnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyName, initialPlayers, setPlayers]);

  return { isDisconnected };
};