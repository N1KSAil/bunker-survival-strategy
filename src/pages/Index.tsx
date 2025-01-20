import PlayerStatus from "@/components/PlayerStatus";
import ResourceTracker from "@/components/ResourceTracker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Типы для характеристик игрока
type PlayerCharacteristics = {
  id: number;
  name: string;
  profession: string;
  professionExperience: string;
  gender: string;
  health: string;
  hobby: string;
  hobbyExperience: string;
  phobia: string;
  bagItem: string;
  specialAbility: string;
  additionalTraits: string;
  onlineStatus: boolean;
  age: number;
  education: string;
};

const INITIAL_PLAYERS: Omit<PlayerCharacteristics, 'name'>[] = [
  {
    id: 1,
    profession: "Врач",
    professionExperience: "15 лет",
    gender: "Женский",
    health: "Здоров",
    hobby: "Садоводство",
    hobbyExperience: "8 лет",
    phobia: "Клаустрофобия",
    bagItem: "Аптечка",
    specialAbility: "Может лечить тяжелые травмы и болезни без медикаментов",
    additionalTraits: "Имеет знания о лекарственных растениях",
    onlineStatus: true,
    age: 42,
    education: "Высшее медицинское",
  },
  {
    id: 2,
    profession: "Инженер",
    professionExperience: "7 лет",
    gender: "Мужской",
    health: "Астма",
    hobby: "Электроника",
    hobbyExperience: "12 лет",
    phobia: "Акрофобия",
    bagItem: "Набор инструментов",
    specialAbility: "Может создавать и ремонтировать сложные механизмы из простых материалов",
    additionalTraits: "Разбирается в альтернативных источниках энергии",
    onlineStatus: false,
    age: 35,
    education: "Высшее техническое",
  },
  {
    id: 3,
    profession: "Военный",
    professionExperience: "20 лет",
    gender: "Мужской",
    health: "Здоров",
    hobby: "Стрельба",
    hobbyExperience: "25 лет",
    phobia: "Агорафобия",
    bagItem: "Оружие",
    specialAbility: "Может обучать других боевым навыкам и тактике выживания",
    additionalTraits: "Имеет опыт выживания в экстремальных условиях",
    onlineStatus: true,
    age: 45,
    education: "Военная академия",
  },
  {
    id: 4,
    profession: "Биолог",
    professionExperience: "10 лет",
    gender: "Женский",
    health: "Аллергия",
    hobby: "Микология",
    hobbyExperience: "5 лет",
    phobia: "Айхмофобия",
    bagItem: "Микроскоп",
    specialAbility: "Может определять съедобные растения и грибы, создавать лекарства",
    additionalTraits: "Знает как очищать воду природными методами",
    onlineStatus: true,
    age: 33,
    education: "Кандидат наук",
  },
  {
    id: 5,
    profession: "Психолог",
    professionExperience: "12 лет",
    gender: "Женский",
    health: "Здоров",
    hobby: "Медитация",
    hobbyExperience: "15 лет",
    phobia: "Никтофобия",
    bagItem: "Книги по психологии",
    specialAbility: "Может предотвращать конфликты и лечить психические травмы",
    additionalTraits: "Владеет техниками снятия стресса",
    onlineStatus: false,
    age: 38,
    education: "Высшее психологическое",
  }
];

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [playerName, setPlayerName] = useState("");

  const handleStartGame = () => {
    if (!playerName.trim()) {
      toast.error("Пожалуйста, введите имя персонажа");
      return;
    }

    setGameStarted(true);
    const playersWithNames = INITIAL_PLAYERS.map((player, index) => ({
      ...player,
      name: index === 0 ? playerName : `Игрок ${player.id}`,
    }));
    setPlayers(playersWithNames);
    toast.success("Игра началась! Характеристики розданы.");
  };

  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text">
      <div className="container mx-auto p-4 space-y-6">
        {/* Level 1 - Catastrophe */}
        <div className="bg-bunker-accent rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-2">Катастрофа</h2>
          <p>Информация о катастрофе будет здесь</p>
        </div>

        {/* Level 2 - Bunker/Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceTracker />
          <div className="bg-bunker-accent rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Ресурсы</h2>
            <p>Дополнительная информация о ресурсах</p>
          </div>
        </div>

        {/* Level 3 - Player Status and Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayerStatus />
          <div className="bg-bunker-accent rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Инвентарь</h2>
            <p>Содержимое инвентаря</p>
          </div>
        </div>

        {/* Level 4 - Game Zone */}
        <div className="w-full bg-bunker-accent rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Игровая зона</h2>
          <div className="space-y-4">
            {!gameStarted ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="playerName" className="block text-sm font-medium">
                    Имя вашего персонажа
                  </label>
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Введите имя персонажа"
                    className="bg-bunker-bg border-bunker-accent"
                  />
                </div>
                <p className="text-bunker-text/80">
                  Нажмите кнопку "Начать игру" чтобы раздать характеристики и начать игру
                </p>
                <Button 
                  onClick={handleStartGame}
                  className="w-full bg-bunker-success hover:bg-bunker-success/90"
                >
                  Начать игру
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Игра началась! Раунд 1</p>
                <div className="rounded border border-bunker-accent overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Профессия</TableHead>
                        <TableHead>Возраст</TableHead>
                        <TableHead>Пол</TableHead>
                        <TableHead>Здоровье</TableHead>
                        <TableHead>Хобби</TableHead>
                        <TableHead>Образование</TableHead>
                        <TableHead>Фобия</TableHead>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Доп. черты</TableHead>
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
                          <TableCell>{player.age}</TableCell>
                          <TableCell>{player.gender}</TableCell>
                          <TableCell>{player.health}</TableCell>
                          <TableCell>{player.hobby} ({player.hobbyExperience})</TableCell>
                          <TableCell>{player.education}</TableCell>
                          <TableCell>{player.phobia}</TableCell>
                          <TableCell>{player.bagItem}</TableCell>
                          <TableCell>{player.additionalTraits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
