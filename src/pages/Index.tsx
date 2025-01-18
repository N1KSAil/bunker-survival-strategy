import { useState } from "react";
import { ResourceTracker } from "@/components/ResourceTracker";
import { PlayerStatus } from "@/components/PlayerStatus";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { toast } = useToast();
  const [currentTurn, setCurrentTurn] = useState(1);
  const [resources, setResources] = useState([
    { name: "Еда", amount: 10, icon: "🍖" },
    { name: "Вода", amount: 15, icon: "💧" },
    { name: "Медикаменты", amount: 5, icon: "💊" },
    { name: "Оружие", amount: 2, icon: "🔫" },
  ]);
  const [playerHealth, setPlayerHealth] = useState(100);

  const handleResourceChange = (resourceName: string, change: number) => {
    setResources(current =>
      current.map(resource => {
        if (resource.name === resourceName) {
          const newAmount = resource.amount + change;
          if (newAmount < 0) {
            toast({
              title: "Невозможно уменьшить",
              description: `${resourceName} уже на нуле`,
              variant: "destructive",
            });
            return resource;
          }
          return { ...resource, amount: newAmount };
        }
        return resource;
      })
    );
  };

  const handleNextTurn = () => {
    setCurrentTurn(prev => prev + 1);
    // Simulate resource consumption
    resources.forEach(resource => {
      handleResourceChange(resource.name, -1);
    });
    
    // Random event chance
    if (Math.random() < 0.3) {
      const events = [
        { title: "Нападение!", description: "Вы теряете 20 очков здоровья", health: -20 },
        { title: "Находка!", description: "Вы нашли припасы", resources: { "Еда": 2, "Вода": 2 } },
        { title: "Болезнь", description: "Вы заболели и теряете здоровье", health: -10 },
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      
      if (event.health) {
        setPlayerHealth(prev => Math.max(0, prev + event.health));
      }
      if (event.resources) {
        Object.entries(event.resources).forEach(([name, amount]) => {
          handleResourceChange(name, amount);
        });
      }
      
      toast({
        title: event.title,
        description: event.description,
      });
    }
  };

  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Бункер</h1>
          <p className="text-xl opacity-80">Ход {currentTurn}</p>
        </header>

        <PlayerStatus name="Игрок 1" health={playerHealth} maxHealth={100} />
        
        <Card className="p-6 bg-bunker-accent">
          <h2 className="text-2xl font-bold mb-4">Ресурсы Бункера</h2>
          <ResourceTracker 
            resources={resources}
            onResourceChange={handleResourceChange}
          />
        </Card>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleNextTurn}
            className="bg-bunker-accent hover:bg-bunker-success text-bunker-text px-8 py-4 text-lg"
          >
            Следующий Ход
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;