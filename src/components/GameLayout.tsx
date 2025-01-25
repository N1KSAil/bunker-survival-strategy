import ResourceTracker from "./ResourceTracker";
import PlayerStatus from "./PlayerStatus";
import GameTable from "./GameTable";
import { Button } from "./ui/button";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";

interface GameLayoutProps {
  players: PlayerCharacteristics[];
  playerName: string;
  currentLobby: LobbyCredentials | null;
  getCurrentPlayerData: () => PlayerCharacteristics | undefined;
  onDeleteLobby?: (name: string, password: string) => void;
}

const GameLayout = ({ 
  players, 
  playerName, 
  currentLobby, 
  getCurrentPlayerData,
  onDeleteLobby 
}: GameLayoutProps) => {
  const isCreator = players[0]?.name === playerName;

  const handleDeleteLobby = () => {
    if (currentLobby && onDeleteLobby) {
      onDeleteLobby(currentLobby.name, currentLobby.password);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResourceTracker />
        <PlayerStatus playerData={getCurrentPlayerData()} />
      </div>

      <div className="w-full bg-bunker-accent rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {currentLobby ? `Лобби: ${currentLobby.name}` : "Игровая зона"}
          </h2>
          {isCreator && currentLobby && (
            <Button 
              variant="destructive"
              onClick={handleDeleteLobby}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить лобби
            </Button>
          )}
        </div>
        <GameTable players={players} currentPlayerName={playerName} />
      </div>
    </div>
  );
};

export default GameLayout;