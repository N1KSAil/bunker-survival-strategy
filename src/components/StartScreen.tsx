import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StartScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartGame: () => void;
}

const StartScreen = ({ playerName, onPlayerNameChange, onStartGame }: StartScreenProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="playerName" className="block text-sm font-medium">
          Имя вашего персонажа
        </label>
        <Input
          id="playerName"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="Введите имя персонажа"
          className="bg-bunker-bg border-bunker-accent"
        />
      </div>
      <p className="text-bunker-text/80">
        Нажмите кнопку "Начать игру" чтобы раздать характеристики и начать игру
      </p>
      <Button 
        onClick={onStartGame}
        className="w-full bg-bunker-success hover:bg-bunker-success/90"
      >
        Начать игру
      </Button>
    </div>
  );
};

export default StartScreen;