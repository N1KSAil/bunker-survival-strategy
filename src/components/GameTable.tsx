import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerCharacteristics } from "@/types/game";

interface GameTableProps {
  players: PlayerCharacteristics[];
}

const GameTable = ({ players }: GameTableProps) => {
  return (
    <div className="rounded border border-bunker-accent overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Профессия</TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Возраст ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Возраст персонажа
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Пол ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Пол персонажа
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Здоровье ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Состояние здоровья
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Хобби ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Хобби и стаж
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Образование ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Уровень образования
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Фобия ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Страхи персонажа
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Предмет ❓
                <span className="invisible group-hover:visible absolute z-10 w-32 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                  Предмет в инвентаре
                </span>
              </span>
            </TableHead>
            <TableHead>
              <span className="cursor-help group relative inline-block">
                Доп. черты ❓
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
              <TableCell className="group relative">
                {player.profession} ({player.professionExperience})
                <span className="cursor-help ml-1">❓
                  <span className="invisible group-hover:visible absolute z-10 w-64 p-2 bg-bunker-bg border border-bunker-accent rounded-lg -translate-y-full left-1/2 -translate-x-1/2">
                    {player.specialAbility}
                  </span>
                </span>
              </TableCell>
              <TableCell className="group relative">
                {player.age}
              </TableCell>
              <TableCell className="group relative">
                {player.gender}
              </TableCell>
              <TableCell className="group relative">
                {player.health}
              </TableCell>
              <TableCell className="group relative">
                {player.hobby} ({player.hobbyExperience})
              </TableCell>
              <TableCell className="group relative">
                {player.education}
              </TableCell>
              <TableCell className="group relative">
                {player.phobia}
              </TableCell>
              <TableCell className="group relative">
                {player.bagItem}
              </TableCell>
              <TableCell className="group relative">
                {player.additionalTraits}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GameTable;