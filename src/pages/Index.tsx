import PlayerStatus from "@/components/PlayerStatus";
import ResourceTracker from "@/components/ResourceTracker";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GameTable from "@/components/GameTable";
import StartScreen from "@/components/StartScreen";
import { PlayerCharacteristics, LobbyCredentials } from "@/types/game";
import { useQuery } from "@tanstack/react-query";

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

const lobbies = new Map<string, { password: string; players: PlayerCharacteristics[] }>();

const checkLobbyExists = async (name: string, password: string) => {
  const lobby = lobbies.get(name);
  if (!lobby) {
    throw new Error("Лобби не существует");
  }
  if (lobby.password !== password) {
    throw new Error("Неверный пароль");
  }
  return lobby;
};

const createLobby = async (name: string, password: string, initialPlayers: PlayerCharacteristics[]) => {
  if (lobbies.has(name)) {
    throw new Error("Лобби с таким названием уже существует");
  }
  lobbies.set(name, { password, players: initialPlayers });
  return { name, password, players: initialPlayers };
};

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<PlayerCharacteristics[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [currentLobby, setCurrentLobby] = useState<LobbyCredentials | null>(null);

  const { data: lobbyData } = useQuery({
    queryKey: ['lobby', currentLobby?.name],
    queryFn: async () => {
      if (!currentLobby) return null;
      try {
        return await checkLobbyExists(currentLobby.name, currentLobby.password);
      } catch (e) {
        toast.error((e as Error).message);
        return null;
      }
    },
    enabled: !!currentLobby,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (lobbyData && gameStarted) {
      setPlayers(lobbyData.players);
    }
  }, [lobbyData, gameStarted]);

  const handleStartGame = async (lobbyCredentials: LobbyCredentials, isCreating: boolean) => {
    if (!playerName.trim()) {
      toast.error("Пожалуйста, введите имя персонажа");
      return;
    }

    try {
      if (isCreating) {
        const playersWithNames = INITIAL_PLAYERS.map((player, index) => ({
          ...player,
          name: index === 0 ? playerName : `Игрок ${player.id}`,
        }));

        await createLobby(lobbyCredentials.name, lobbyCredentials.password, playersWithNames);
        setGameStarted(true);
        setCurrentLobby(lobbyCredentials);
        setPlayers(playersWithNames);
        toast.success(`Лобби ${lobbyCredentials.name} создано! Характеристики розданы.`);
      } else {
        const lobby = await checkLobbyExists(lobbyCredentials.name, lobbyCredentials.password);
        
        // Находим первого бота и заменяем его на нового игрока
        const firstBotIndex = lobby.players.findIndex(player => player.name.startsWith('Игрок'));
        
        if (firstBotIndex === -1) {
          throw new Error("Лобби уже заполнено");
        }

        const updatedPlayers = lobby.players.map((player, index) => {
          if (index === firstBotIndex) {
            return {
              ...player,
              name: playerName,
            };
          }
          return player;
        });

        lobbies.set(lobbyCredentials.name, {
          password: lobbyCredentials.password,
          players: updatedPlayers,
        });

        setGameStarted(true);
        setCurrentLobby(lobbyCredentials);
        setPlayers(updatedPlayers);
        toast.success(`Вы присоединились к лобби ${lobbyCredentials.name}!`);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text">
      <div className="container mx-auto p-4 space-y-6">
        <div className="bg-bunker-accent rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-2">Катастрофа</h2>
          <p>Информация о катастрофе будет здесь</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceTracker />
          <div className="bg-bunker-accent rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Ресурсы</h2>
            <p>Дополнительная информация о ресурсах</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayerStatus />
          <div className="bg-bunker-accent rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Инвентарь</h2>
            <p>Содержимое инвентаря</p>
          </div>
        </div>

        <div className="w-full bg-bunker-accent rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            {currentLobby ? `Лобби: ${currentLobby.name}` : "Игровая зона"}
          </h2>
          <div className="space-y-4">
            {!gameStarted ? (
              <StartScreen
                playerName={playerName}
                onPlayerNameChange={setPlayerName}
                onStartGame={handleStartGame}
              />
            ) : (
              <GameTable players={players} currentPlayerName={playerName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;