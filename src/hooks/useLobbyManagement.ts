import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LobbyData, getLobbiesFromStorage, saveLobbiesToStorage } from "@/utils/lobbyStorage";
import { PlayerCharacteristics } from "@/types/game";

export const useLobbyManagement = () => {
  const [lobbies, setLobbies] = useState<Map<string, LobbyData>>(getLobbiesFromStorage());

  const loadLobbiesFromStorage = async () => {
    try {
      // First, get lobbies from Supabase
      const { data: supabaseLobbies, error } = await supabase
        .from('lobby_participants')
        .select('*');

      if (error) {
        console.error("Error loading lobbies from Supabase:", error);
        throw error;
      }

      // Convert Supabase data to our lobby format
      const loadedLobbies = new Map<string, LobbyData>();
      supabaseLobbies.forEach(lobby => {
        loadedLobbies.set(lobby.lobby_name, {
          password: lobby.lobby_password,
          players: [] // We'll need to implement player loading separately
        });
      });

      // Update local storage with Supabase data
      saveLobbiesToStorage(loadedLobbies);
      setLobbies(loadedLobbies);
      return loadedLobbies;
    } catch (error) {
      console.error("Error in loadLobbiesFromStorage:", error);
      const localLobbies = getLobbiesFromStorage();
      setLobbies(localLobbies);
      return localLobbies;
    }
  };

  const checkLobbyExists = async (name: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('lobby_participants')
      .select('lobby_name')
      .eq('lobby_name', name)
      .maybeSingle();

    if (error) {
      console.error("Error checking lobby existence:", error);
      return false;
    }

    return data !== null;
  };

  const checkLobbyPassword = (name: string, password: string): boolean => {
    const lobby = lobbies.get(name);
    return lobby?.password === password;
  };

  const createLobby = async (name: string, password: string, firstPlayer: PlayerCharacteristics) => {
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
      console.error("Error creating lobby:", error);
      throw new Error("Ошибка при создании лобби");
    }
    
    const newLobby = { password, players: [firstPlayer] };
    const updatedLobbies = new Map(lobbies);
    updatedLobbies.set(name, newLobby);
    setLobbies(updatedLobbies);
    saveLobbiesToStorage(updatedLobbies);
    
    return newLobby;
  };

  const deleteLobby = async (name: string, password: string) => {
    const exists = await checkLobbyExists(name);
    if (!exists) {
      throw new Error("Лобби не существует");
    }
    
    if (!checkLobbyPassword(name, password)) {
      throw new Error("Неверный пароль");
    }

    const { error } = await supabase
      .from('lobby_participants')
      .delete()
      .eq('lobby_name', name);

    if (error) {
      console.error("Error deleting lobby:", error);
      throw new Error("Ошибка при удалении лобби");
    }

    const updatedLobbies = new Map(lobbies);
    updatedLobbies.delete(name);
    setLobbies(updatedLobbies);
    saveLobbiesToStorage(updatedLobbies);
    toast.success(`Лобби ${name} удалено`);
    
    return true;
  };

  const deleteAllLobbies = async () => {
    const { error } = await supabase
      .from('lobby_participants')
      .delete()
      .not('id', 'is', null);

    if (error) {
      console.error("Error deleting all lobbies:", error);
      throw new Error("Ошибка при удалении всех лобби");
    }

    setLobbies(new Map());
    saveLobbiesToStorage(new Map());
    toast.success('Все лобби удалены');
    return true;
  };

  return {
    lobbies,
    checkLobbyExists,
    checkLobbyPassword,
    createLobby,
    deleteLobby,
    deleteAllLobbies,
    loadLobbiesFromStorage
  };
};