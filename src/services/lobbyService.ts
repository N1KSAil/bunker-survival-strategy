import { supabase } from "@/integrations/supabase/client";
import { lobbyStorage } from "@/utils/lobbyStorageManager";
import { LobbyData } from "@/types/lobby";
import { PlayerCharacteristics } from "@/types/game";
import { toast } from "sonner";

export const checkLobbyExists = async (name: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('lobby_participants')
      .select('lobby_name')
      .eq('lobby_name', name)
      .maybeSingle();

    if (error) {
      console.error("Ошибка при проверке существования лобби:", error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error("Ошибка при проверке существования лобби:", error);
    return false;
  }
};

export const checkLobbyPassword = (name: string, password: string): boolean => {
  const lobby = lobbyStorage.get(name);
  return lobby?.password === password;
};

export const createLobby = async (
  name: string, 
  password: string, 
  firstPlayer: PlayerCharacteristics
): Promise<LobbyData> => {
  const exists = await checkLobbyExists(name);
  if (exists) {
    throw new Error("Лобби с таким названием уже существует");
  }
  
  const { error } = await supabase
    .from('lobby_participants')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      lobby_name: name,
      lobby_password: password
    });

  if (error) {
    console.error("Ошибка при создании лобби:", error);
    throw new Error("Ошибка при создании лобби");
  }
  
  const newLobby: LobbyData = { password, players: [firstPlayer] };
  lobbyStorage.set(name, newLobby);
  
  return newLobby;
};

export const deleteLobby = async (name: string, password: string): Promise<boolean> => {
  try {
    const exists = await checkLobbyExists(name);
    if (!exists) {
      toast.error("Лобби не найдено");
      return false;
    }

    if (!checkLobbyPassword(name, password)) {
      toast.error("Неверный пароль лобби");
      return false;
    }

    const { error } = await supabase
      .from('lobby_participants')
      .delete()
      .eq('lobby_name', name);

    if (error) {
      console.error("Ошибка при удалении лобби:", error);
      toast.error("Ошибка при удалении лобби");
      return false;
    }

    lobbyStorage.delete(name);
    toast.success("Лобби успешно удалено");
    return true;
  } catch (error) {
    console.error("Ошибка при удалении лобби:", error);
    toast.error("Произошла ошибка при удалении лобби");
    return false;
  }
};

export const deleteAllLobbies = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lobby_participants')
      .delete()
      .not('id', 'is', null);

    if (error) {
      console.error("Ошибка при удалении всех лобби:", error);
      toast.error("Ошибка при удалении всех лобби");
      return false;
    }

    lobbyStorage.clear();
    toast.success("Все лобби успешно удалены");
    return true;
  } catch (error) {
    console.error("Ошибка при удалении всех лобби:", error);
    toast.error("Произошла ошибка при удалении всех лобби");
    return false;
  }
};

export const loadLobbiesFromStorage = async (): Promise<Map<string, LobbyData>> => {
  try {
    const { data: supabaseLobbies, error } = await supabase
      .from('lobby_participants')
      .select('*');

    if (error) {
      console.error("Ошибка при загрузке лобби из базы данных:", error);
      return new Map();
    }

    const lobbies = new Map<string, LobbyData>();
    supabaseLobbies.forEach(lobby => {
      lobbies.set(lobby.lobby_name, {
        password: lobby.lobby_password,
        players: []
      });
    });

    return lobbies;
  } catch (error) {
    console.error("Ошибка в loadLobbiesFromStorage:", error);
    return new Map();
  }
};