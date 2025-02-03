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
  const authCheckInProgress = useRef(false);
  const timersStarted = useRef<Set<string>>(new Set());
  
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

  const startTimer = (name: string) => {
    if (!timersStarted.current.has(name)) {
      console.time(name);
      timersStarted.current.add(name);
    }
  };

  const endTimer = (name: string) => {
    if (timersStarted.current.has(name)) {
      console.timeEnd(name);
      timersStarted.current.delete(name);
    }
  };

  const clearAllTimers = () => {
    timersStarted.current.forEach(timerName => {
      try {
        console.timeEnd(timerName);
      } catch (e) {
        // Игнорируем ошибки при очистке таймеров
      }
    });
    timersStarted.current.clear();
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckCompleted.current || authCheckInProgress.current) return;
      
      authCheckInProgress.current = true;
      clearAllTimers();
      
      startTimer('Total Auth Check');
      console.log('Starting auth check...');
      
      try {
        startTimer('Get Session');
        const { data: { session } } = await supabase.auth.getSession();
        endTimer('Get Session');
        
        if (!isMounted.current) return;
        
        const isAuthed = !!session;
        console.log('Authentication status:', isAuthed);
        setIsAuthenticated(isAuthed);
        
        if (isAuthed && session) {
          startTimer('Reconnect to Lobby');
          const reconnected = await checkAndReconnectToLobby(session.user.id);
          endTimer('Reconnect to Lobby');
          console.log('Lobby reconnection status:', reconnected);
          
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
          console.log('Completing auth check...');
          authCheckCompleted.current = true;
          authCheckInProgress.current = false;
          setIsAuthChecking(false);
          endTimer('Total Auth Check');
        }
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted.current) return;
      
      console.log('Auth state changed:', !!session);
      setIsAuthenticated(!!session);
      
      if (!session) {
        resetGameState();
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
      clearAllTimers();
    };
  }, [checkAndReconnectToLobby, resetGameState, setIsAuthChecking]);

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