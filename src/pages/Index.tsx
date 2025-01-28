import { useState, useEffect } from "react";
import { useLobby } from "@/hooks/useLobby";
import StartScreen from "@/components/StartScreen";
import GameLayout from "@/components/GameLayout";
import { INITIAL_PLAYERS } from "@/data/initialPlayers";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progress, setProgress] = useState(0);
  const { 
    gameStarted, 
    players, 
    currentLobby,
    isLoading,
    isAuthChecking,
    handleStartGame, 
    deleteLobby,
    deleteAllLobbies,
    getCurrentPlayerData,
    checkAndReconnectToLobby,
    resetGameState
  } = useLobby(playerName, INITIAL_PLAYERS);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (session) {
          const reconnected = await checkAndReconnectToLobby(session.user.id);
          if (reconnected) {
            toast.success("Переподключение к лобби выполнено успешно");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isAuthed = !!session;
      setIsAuthenticated(isAuthed);
      
      if (!isAuthed) {
        resetGameState();
      } else if (session) {
        await checkAndReconnectToLobby(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAndReconnectToLobby, resetGameState]);

  useEffect(() => {
    let progressTimer: number | undefined;
    let resetTimer: number | undefined;

    if (isAuthChecking || isLoading) {
      progressTimer = window.setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 2, 100);
          return newProgress;
        });
      }, 50);
    } else {
      setProgress(100);
      resetTimer = window.setTimeout(() => setProgress(0), 500);
    }

    return () => {
      if (progressTimer) window.clearInterval(progressTimer);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, [isAuthChecking, isLoading]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-bunker-bg text-bunker-text flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <p className="text-center mb-4">Проверка авторизации...</p>
          <Progress value={progress} className="w-full" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bunker-bg text-bunker-text flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <p className="text-center mb-4">Загрузка...</p>
          <Progress value={progress} className="w-full" />
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