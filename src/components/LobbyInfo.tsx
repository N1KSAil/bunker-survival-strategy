import { LobbyCredentials } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import ReconnectButton from "./ReconnectButton";

interface LobbyInfoProps {
  lobby: LobbyCredentials | null;
  playersCount: number;
  isDisconnected?: boolean;
  onReconnect?: (lobby: LobbyCredentials) => void;
}

const LobbyInfo = ({ lobby, playersCount, isDisconnected, onReconnect }: LobbyInfoProps) => {
  if (!lobby) return null;

  return (
    <Card className="bg-bunker-accent">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Информация о лобби
          <Badge variant="secondary" className="ml-2">
            {playersCount} игроков
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-semibold">Название:</span> {lobby.name}
        </div>
        <div>
          <span className="font-semibold">Код доступа:</span> {lobby.password}
        </div>
        {isDisconnected && onReconnect && (
          <div className="pt-2">
            <ReconnectButton lobby={lobby} onReconnect={onReconnect} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LobbyInfo;