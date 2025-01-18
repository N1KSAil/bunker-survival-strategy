import PlayerStatus from "@/components/PlayerStatus";
import ResourceTracker from "@/components/ResourceTracker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
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
                    <p>Игра началась! Раунд 1</p>
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