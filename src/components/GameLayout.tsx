import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import PlayerStatus from "./PlayerStatus";
import GameTable from "./GameTable";
import { toast } from "sonner";

interface GameLayoutProps {
  players: PlayerCharacteristics[];
  playerName: string;
  currentLobby: LobbyCredentials | null;
  getCurrentPlayerData: () => PlayerCharacteristics | undefined;
  onCloseLobby?: () => void;
}

const GameLayout = ({ 
  players, 
  playerName, 
  currentLobby,
  getCurrentPlayerData,
  onCloseLobby 
}: GameLayoutProps) => {
  const isLobbyCreator = players[0]?.name === playerName;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Лобби: {currentLobby?.name}
        </h2>
        {isLobbyCreator && (
          <Button
            variant="destructive"
            onClick={() => {
              if (onCloseLobby) {
                onCloseLobby();
                toast.success("Лобби закрыто");
              }
            }}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Закрыть лобби
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <PlayerStatus
          players={players}
          currentPlayerName={playerName}
        />
        <GameTable
          players={players}
          currentPlayerName={playerName}
          getCurrentPlayerData={getCurrentPlayerData}
        />
      </div>
    </div>
  );
};

export default GameLayout;