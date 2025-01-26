import { useState, useEffect } from "react";
import { useLobby } from "@/hooks/useLobby";
import StartScreen from "@/components/StartScreen";
import GameLayout from "@/components/GameLayout";
import { INITIAL_PLAYERS } from "@/data/initialPlayers";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    gameStarted, 
    players, 
    currentLobby, 
    handleStartGame, 
    deleteLobby,
    deleteAllLobbies,
    getCurrentPlayerData,
    checkAndReconnectToLobby 
  } = useLobby(playerName, INITIAL_PLAYERS);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (session) {
          // Check if user is in a lobby and reconnect if needed
          const reconnected = await checkAndReconnectToLobby(session.user.id);
          if (reconnected) {
            toast.success("Переподключение к лобби выполнено успешно");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Ошибка при проверке авторизации");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        await checkAndReconnectToLobby(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAndReconnectToLobby]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bunker-bg text-bunker-text flex items-center justify-center">
        <div className="text-center">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bunker-bg text-bunker-text">
        <div className="container mx-auto p-4 max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Добро пожаловать</h1>
          <AuthForm onSuccess={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text">
      <div className="container mx-auto p-4 space-y-6">
        {!gameStarted ? (
          <StartScreen
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onStartGame={handleStartGame}
          />
        ) : (
          <GameLayout
            players={players}
            playerName={playerName}
            currentLobby={currentLobby}
            getCurrentPlayerData={getCurrentPlayerData}
            onDeleteLobby={deleteLobby}
            onDeleteAllLobbies={deleteAllLobbies}
          />
        )}
      </div>
    </div>
  );
};

export default Index;