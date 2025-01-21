import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LobbyCredentials } from "@/types/game";
import { toast } from "sonner";

interface StartScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartGame: (lobbyCredentials: LobbyCredentials, isCreating: boolean) => void;
}

const StartScreen = ({ playerName, onPlayerNameChange, onStartGame }: StartScreenProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");

  const handleSubmit = () => {
    if (!playerName.trim()) {
      toast.error("Пожалуйста, введите имя персонажа");
      return;
    }
    if (!lobbyName.trim() || !lobbyPassword.trim()) {
      toast.error("Пожалуйста, заполните название и пароль лобби");
      return;
    }

    onStartGame({ name: lobbyName, password: lobbyPassword }, isCreating);
    setIsCreating(false);
    setIsJoining(false);
  };

  const renderLobbyForm = () => (
    <div className="space-y-4">
      <Input
        value={lobbyName}
        onChange={(e) => setLobbyName(e.target.value)}
        placeholder="Название лобби"
        className="bg-bunker-bg border-bunker-accent"
      />
      <Input
        type="password"
        value={lobbyPassword}
        onChange={(e) => setLobbyPassword(e.target.value)}
        placeholder="Пароль лобби"
        className="bg-bunker-bg border-bunker-accent"
      />
      <div className="flex gap-2">
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-bunker-success hover:bg-bunker-success/90"
        >
          {isCreating ? "Создать" : "Войти"}
        </Button>
        <Button 
          onClick={() => {
            setIsCreating(false);
            setIsJoining(false);
          }}
          variant="outline"
          className="flex-1"
        >
          Отмена
        </Button>
      </div>
    </div>
  );

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
      
      {!isCreating && !isJoining ? (
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsJoining(true)}
            className="flex-1 bg-bunker-success hover:bg-bunker-success/90"
          >
            Зайти в лобби
          </Button>
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex-1 bg-bunker-success hover:bg-bunker-success/90"
          >
            Создать лобби
          </Button>
        </div>
      ) : (
        renderLobbyForm()
      )}
    </div>
  );
};

export default StartScreen;