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
  const authCheckRef = useRef(false);
  
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
      if (authCheckRef.current) return;
      authCheckRef.current = true;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);
        
        if (isAuthed && session) {
          await checkAndReconnectToLobby(session.user.id);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Ошибка при проверке авторизации");
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      
      if (!session) {
        resetGameState();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAndReconnectToLobby, resetGameState, setIsAuthChecking]);

  if (isAuthChecking) {
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