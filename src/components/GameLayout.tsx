import ResourceTracker from "./ResourceTracker";
import PlayerStatus from "./PlayerStatus";
import GameTable from "./GameTable";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";

interface GameLayoutProps {
  players: PlayerCharacteristics[];
  playerName: string;
  currentLobby: LobbyCredentials | null;
  getCurrentPlayerData: () => PlayerCharacteristics | undefined;
}

const GameLayout = ({ players, playerName, currentLobby, getCurrentPlayerData }: GameLayoutProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResourceTracker />
        <PlayerStatus playerData={getCurrentPlayerData()} />
      </div>

      <div className="w-full bg-bunker-accent rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">
          {currentLobby ? `Лобби: ${currentLobby.name}` : "Игровая зона"}
        </h2>
        <GameTable players={players} currentPlayerName={playerName} />
      </div>
    </>
  );
};

export default GameLayout;