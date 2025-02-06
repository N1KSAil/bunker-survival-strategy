import { useState } from "react";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { useLobbyRealtime } from "@/hooks/useLobbyRealtime";
import { Button } from "./ui/button";
import { LogOut, Trash, Trash2 } from "lucide-react";
import LobbyInfo from "./LobbyInfo";
import GameTable from "./GameTable";

interface GameLayoutProps {
  players: PlayerCharacteristics[];
  playerName: string;
  currentLobby: LobbyCredentials | null;
  getCurrentPlayerData: () => PlayerCharacteristics | undefined;
  onDeleteLobby: (name: string, password: string) => Promise<boolean>;
  onDeleteAllLobbies: () => Promise<boolean>;
  resetGameState: () => void;
  onReconnect?: (lobby: LobbyCredentials) => void;
}

const GameLayout = ({
  players,
  playerName,
  currentLobby,
  getCurrentPlayerData,
  onDeleteLobby,
  onDeleteAllLobbies,
  resetGameState,
  onReconnect
}: GameLayoutProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isDisconnected } = useLobbyRealtime(currentLobby?.name ?? null, [], () => {});

  const handleDeleteLobby = async () => {
    if (!currentLobby) return;
    setIsDeleting(true);
    try {
      const success = await onDeleteLobby(currentLobby.name, currentLobby.password);
      if (success) {
        resetGameState();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllLobbies = async () => {
    setIsDeleting(true);
    try {
      const success = await onDeleteAllLobbies();
      if (success) {
        resetGameState();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-start gap-4 flex-col lg:flex-row">
        <div className="w-full lg:w-1/3">
          <LobbyInfo 
            lobby={currentLobby} 
            playersCount={players.length} 
            isDisconnected={isDisconnected}
            onReconnect={onReconnect}
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={resetGameState}
            className="w-full lg:w-auto"
          >
            <LogOut className="mr-2" />
            Выйти
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteLobby}
            disabled={isDeleting}
            className="w-full lg:w-auto"
          >
            <Trash className="mr-2" />
            Удалить лобби
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAllLobbies}
            disabled={isDeleting}
            className="w-full lg:w-auto"
          >
            <Trash2 className="mr-2" />
            Удалить все
          </Button>
        </div>
      </div>

      <GameTable
        players={players}
        currentPlayer={getCurrentPlayerData()}
      />
    </div>
  );
};

export default GameLayout;