import { LobbyCredentials, PlayerCharacteristics } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import ReconnectButton from "./ReconnectButton";
import { ScrollArea } from "./ui/scroll-area";

interface LobbyInfoProps {
  lobby: LobbyCredentials | null;
  playersCount: number;
  players?: PlayerCharacteristics[];
  isDisconnected?: boolean;
  onReconnect?: (lobby: LobbyCredentials) => void;
}

const LobbyInfo = ({ lobby, playersCount, players = [], isDisconnected, onReconnect }: LobbyInfoProps) => {
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
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Название:</span> {lobby.name}
          </div>
          <div>
            <span className="font-semibold">Код доступа:</span> {lobby.password}
          </div>
        </div>

        {players.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Игроки в лобби:</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {players.map((player, index) => (
                <div key={player.id} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-md mb-2">
                    {player.name} {player.onlineStatus ? "🟢" : "🔴"}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Профессия:</span> {player.profession} ({player.professionExperience})</div>
                    <div><span className="font-medium">Возраст:</span> {player.age}</div>
                    <div><span className="font-medium">Пол:</span> {player.gender}</div>
                    <div><span className="font-medium">Здоровье:</span> {player.health}</div>
                    <div><span className="font-medium">Образование:</span> {player.education}</div>
                    <div><span className="font-medium">Хобби:</span> {player.hobby} ({player.hobbyExperience})</div>
                    <div><span className="font-medium">Фобия:</span> {player.phobia}</div>
                    <div><span className="font-medium">Предмет в сумке:</span> {player.bagItem}</div>
                    <div><span className="font-medium">Особая способность:</span> {player.specialAbility}</div>
                    <div><span className="font-medium">Дополнительные черты:</span> {player.additionalTraits}</div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

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