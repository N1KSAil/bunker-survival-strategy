import { useState } from "react";
import { ResourceTracker } from "@/components/ResourceTracker";
import { PlayerStatus } from "@/components/PlayerStatus";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [currentTurn, setCurrentTurn] = useState(1);
  const [resources, setResources] = useState([
    { name: "Food", amount: 10, icon: "🍖" },
    { name: "Water", amount: 15, icon: "💧" },
    { name: "Medicine", amount: 5, icon: "💊" },
  ]);
  const [playerHealth, setPlayerHealth] = useState(100);

  const handleResourceChange = (resourceName: string, change: number) => {
    setResources(current =>
      current.map(resource => {
        if (resource.name === resourceName) {
          const newAmount = resource.amount + change;
          if (newAmount < 0) {
            toast({
              title: "Cannot reduce further",
              description: `${resourceName} is already at 0`,
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
    toast({
      title: "Turn " + (currentTurn + 1),
      description: "Resources have been consumed",
    });
  };

  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Bunker</h1>
          <p className="text-xl opacity-80">Turn {currentTurn}</p>
        </header>

        <PlayerStatus name="Player 1" health={playerHealth} maxHealth={100} />
        
        <ResourceTracker 
          resources={resources}
          onResourceChange={handleResourceChange}
        />

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleNextTurn}
            className="bg-bunker-accent hover:bg-bunker-success text-bunker-text px-8 py-4 text-lg"
          >
            Next Turn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;