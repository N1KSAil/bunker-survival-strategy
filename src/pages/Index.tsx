import { useState } from "react";
import { useLobby } from "@/hooks/useLobby";
import StartScreen from "@/components/StartScreen";
import GameLayout from "@/components/GameLayout";
import { INITIAL_PLAYERS } from "@/data/initialPlayers";

const Index = () => {
  const [playerName, setPlayerName] = useState("");
  const { 
    gameStarted, 
    players, 
    currentLobby, 
    handleStartGame, 
    getCurrentPlayerData 
  } = useLobby(playerName, INITIAL_PLAYERS);

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
          />
        )}
      </div>
    </div>
  );
};

export default Index;