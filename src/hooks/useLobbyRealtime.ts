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
            .select('*')
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
            name: p.user_id,
            onlineStatus: true,
            profession: p.profession || initialPlayers[index].profession,
            professionExperience: p.profession_experience || initialPlayers[index].professionExperience,
            age: p.age || initialPlayers[index].age,
            gender: p.gender || initialPlayers[index].gender,
            health: p.health || initialPlayers[index].health,
            education: p.education || initialPlayers[index].education,
            hobby: p.hobby || initialPlayers[index].hobby,
            hobbyExperience: p.hobby_experience || initialPlayers[index].hobbyExperience,
            phobia: p.phobia || initialPlayers[index].phobia,
            bagItem: p.bag_item || initialPlayers[index].bagItem,
            specialAbility: p.special_ability || initialPlayers[index].specialAbility,
            additionalTraits: p.additional_traits || initialPlayers[index].additionalTraits,
          }));

          setPlayers(updatedPlayers);
          setIsDisconnected(false);

          if (payload.eventType === 'INSERT') {
            toast.success(`Игрок ${payload.new.user_id} присоединился к лобби!`);
          } else if (payload.eventType === 'DELETE') {
            toast.error(`Игрок ${payload.old.user_id} покинул лобби`);
          } else if (payload.eventType === 'UPDATE') {
            toast.info(`Игрок ${payload.new.user_id} обновил свои данные`);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Подключено к каналу реального времени');
          setIsDisconnected(false);
        } else {
          console.log('Отключено от канала реального времени');
          setIsDisconnected(true);
        }
      });

    return () => {
      console.log('Отписка от канала реального времени');
      supabase.removeChannel(channel);
    };
  }, [lobbyName, initialPlayers, setPlayers]);

  return { isDisconnected };
};