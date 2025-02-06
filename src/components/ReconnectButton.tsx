import { Button } from "./ui/button";
import { LobbyCredentials } from "@/types/game";
import { RefreshCw } from "lucide-react";

interface ReconnectButtonProps {
  lobby: LobbyCredentials;
  onReconnect: (lobby: LobbyCredentials) => void;
}

const ReconnectButton = ({ lobby, onReconnect }: ReconnectButtonProps) => {
  return (
    <Button
      onClick={() => onReconnect(lobby)}
      variant="secondary"
      className="w-full"
    >
      <RefreshCw className="mr-2" />
      Переподключиться к лобби
    </Button>
  );
};

export default ReconnectButton;