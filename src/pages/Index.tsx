import { useState, useEffect, useRef } from "react";
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
  const isMounted = useRef(true);
  const authCheckCompleted = useRef(false);
  
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
      if (authCheckCompleted.current) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted.current) return;
        
        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);
        
        if (isAuthed && session) {
          const reconnected = await checkAndReconnectToLobby(session.user.id);
          if (reconnected && isMounted.current) {
            toast.success("Переподключение к лобби выполнено успешно");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        if (isMounted.current) {
          authCheckCompleted.current = true;
        }
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted.current) return;
      
      const isAuthed = !!session;
      setIsAuthenticated(isAuthed);
      
      if (!isAuthed) {
        resetGameState();
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [checkAndReconnectToLobby, resetGameState]);

  useEffect(() => {
    let progressTimer: number | undefined;

    if (isAuthChecking || isLoading) {
      setProgress(0);
      progressTimer = window.setInterval(() => {
        setProgress((oldProgress) => {
          if (!isMounted.current) return oldProgress;
          return Math.min(oldProgress + 5, 95); // Увеличил скорость прогресса
        });
      }, 50);
    } else {
      setProgress(100);
    }

    return () => {
      if (progressTimer) {
        window.clearInterval(progressTimer);
      }
    };
  }, [isAuthChecking, isLoading]);

  if (!authCheckCompleted.current) {
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