import { useState, useEffect, useRef } from "react";
import { useLobby } from "@/hooks/useLobby";
import StartScreen from "@/components/StartScreen";
import GameLayout from "@/components/GameLayout";
import { INITIAL_PLAYERS } from "@/data/initialPlayers";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";
import MainContainer from "@/components/MainContainer";
import { useProgress } from "@/hooks/useProgress";

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMounted = useRef(true);
  const authCheckCompleted = useRef(false);
  
  const { 
    gameStarted, 
    players, 
    currentLobby,
    isLoading,
    isAuthChecking,
    setIsAuthChecking,
    handleStartGame, 
    deleteLobby,
    deleteAllLobbies,
    getCurrentPlayerData,
    checkAndReconnectToLobby,
    resetGameState
  } = useLobby(playerName, INITIAL_PLAYERS);

  const progress = useProgress(isLoading, isAuthChecking);

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
        if (isMounted.current) {
          toast.error("Ошибка при проверке авторизации");
        }
      } finally {
        if (isMounted.current) {
          authCheckCompleted.current = true;
          setIsAuthChecking(false); // Важно установить в false после завершения проверки
        }
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted.current) return;
      
      setIsAuthenticated(!!session);
      
      if (!session) {
        resetGameState();
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [checkAndReconnectToLobby, resetGameState, setIsAuthChecking]);

  // Показываем LoadingScreen только во время первичной проверки авторизации
  if (!authCheckCompleted.current) {
    return <LoadingScreen progress={progress} />;
  }

  if (!isAuthenticated) {
    return (
      <MainContainer>
        <h1 className="text-2xl font-bold mb-6 text-center">Добро пожаловать</h1>
        <AuthForm onSuccess={() => setIsAuthenticated(true)} />
      </MainContainer>
    );
  }

  if (isLoading) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <MainContainer>
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
    </MainContainer>
  );
};

export default Index;