import PlayerStatus from "@/components/PlayerStatus";
import ResourceTracker from "@/components/ResourceTracker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
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
  profession: string;
  gender: string;
  health: string;
  hobby: string;
  phobia: string;
  bagItem: string;
  specialAbility: string;
};

const INITIAL_PLAYERS: PlayerCharacteristics[] = [
  {
    id: 1,
    profession: "Врач",
    gender: "Женский",
    health: "Здоров",
    hobby: "Садоводство",
    phobia: "Клаустрофобия",
    bagItem: "Аптечка",
    specialAbility: "Лечение",
  },
  {
    id: 2,
    profession: "Инженер",
    gender: "Мужской",
    health: "Астма",
    hobby: "Электроника",
    phobia: "Акрофобия",
    bagItem: "Набор инструментов",
    specialAbility: "Ремонт",
  },
  {
    id: 3,
    profession: "Военный",
    gender: "Мужской",
    health: "Здоров",
    hobby: "Стрельба",
    phobia: "Агорафобия",
    bagItem: "Оружие",
    specialAbility: "Защита",
  },
];

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);

  const handleStartGame = () => {
    setGameStarted(true);
    setPlayers(INITIAL_PLAYERS);
    toast.success("Игра началась! Характеристики розданы.");
  };

  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Бункер</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left sidebar - Player Status */}
          <div className="md:col-span-3">
            <PlayerStatus />
          </div>
          
          {/* Main game area */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-bunker-accent rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Игровая зона</h2>
              <div className="space-y-4">
                <div className="bg-bunker-bg p-4 rounded">
                  <h3 className="font-medium mb-4">Текущий раунд</h3>
                  {!gameStarted ? (
                    <div className="space-y-4">
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
                      <div className="rounded border border-bunker-accent overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Игрок</TableHead>
                              <TableHead>Профессия</TableHead>
                              <TableHead>Пол</TableHead>
                              <TableHead>Здоровье</TableHead>
                              <TableHead>Хобби</TableHead>
                              <TableHead>Фобия</TableHead>
                              <TableHead>Предмет</TableHead>
                              <TableHead>Способность</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {players.map((player) => (
                              <TableRow key={player.id}>
                                <TableCell>Игрок {player.id}</TableCell>
                                <TableCell>{player.profession}</TableCell>
                                <TableCell>???</TableCell>
                                <TableCell>???</TableCell>
                                <TableCell>???</TableCell>
                                <TableCell>???</TableCell>
                                <TableCell>???</TableCell>
                                <TableCell>???</TableCell>
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
          
          {/* Right sidebar - Resources */}
          <div className="md:col-span-3">
            <ResourceTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;