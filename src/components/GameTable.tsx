import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerCharacteristics } from "@/types/game";
import { Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface GameTableProps {
  players: PlayerCharacteristics[];
  currentPlayerName: string;
}

const GameTable = ({ players, currentPlayerName }: GameTableProps) => {
  const [revealedCharacteristics, setRevealedCharacteristics] = useState<{
    [key: string]: Set<string>;
  }>({});

  // Загрузка раскрытых характеристик из localStorage
  useEffect(() => {
    const loadRevealedCharacteristics = () => {
      const saved = localStorage.getItem('revealedCharacteristics');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Преобразуем обычные массивы обратно в Set
        const converted = Object.fromEntries(
          Object.entries(parsed).map(([key, value]) => [key, new Set(value)])
        );
        setRevealedCharacteristics(converted);
      }
    };

    // Загружаем при монтировании
    loadRevealedCharacteristics();

    // Устанавливаем интервал для периодической проверки
    const interval = setInterval(loadRevealedCharacteristics, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRevealCharacteristic = (playerName: string, characteristic: string) => {
    setRevealedCharacteristics((prev) => {
      const newState = { ...prev };
      if (!newState[characteristic]) {
        newState[characteristic] = new Set();
      }
      newState[characteristic].add(playerName);

      // Сохраняем в localStorage
      const forStorage = Object.fromEntries(
        Object.entries(newState).map(([key, value]) => [key, Array.from(value)])
      );
      localStorage.setItem('revealedCharacteristics', JSON.stringify(forStorage));

      return newState;
    });
    toast.success(`Характеристика "${characteristic}" раскрыта для всех игроков`);
  };

  const renderCharacteristicCell = (
    player: PlayerCharacteristics,
    characteristic: keyof PlayerCharacteristics,
    displayName: string
  ) => {
    const isCurrentPlayer = player.name === currentPlayerName;
    const isRevealed = revealedCharacteristics[characteristic]?.has(player.name);

    if (isCurrentPlayer) {
      return (
        <TableCell className="group relative">
          {player[characteristic]}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="ml-2">
                <Lock className="w-4 h-4 inline-block cursor-pointer" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Раскрыть характеристику?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите раскрыть характеристику "{displayName}" для всех игроков?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRevealCharacteristic(player.name, characteristic)}
                >
                  Раскрыть
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      );
    }

    return (
      <TableCell className="group relative">
        {isRevealed ? player[characteristic] : "???"}
      </TableCell>
    );
  };

  return (
    <div className="rounded border border-bunker-accent overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Профессия</TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Возраст
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Возраст персонажа
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Пол
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Пол персонажа
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Здоровье
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Состояние здоровья
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Хобби
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Хобби и стаж
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Образование
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Уровень образования
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Фобия
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Страхи персонажа
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Предмет
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Предмет в инвентаре
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Доп. черты
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Дополнительные характеристики
                </span>
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              {renderCharacteristicCell(player, "profession", "Профессия")}
              {renderCharacteristicCell(player, "age", "Возраст")}
              {renderCharacteristicCell(player, "gender", "Пол")}
              {renderCharacteristicCell(player, "health", "Здоровье")}
              {renderCharacteristicCell(player, "hobby", "Хобби")}
              {renderCharacteristicCell(player, "education", "Образование")}
              {renderCharacteristicCell(player, "phobia", "Фобия")}
              {renderCharacteristicCell(player, "bagItem", "Предмет")}
              {renderCharacteristicCell(player, "additionalTraits", "Доп. черты")}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GameTable;