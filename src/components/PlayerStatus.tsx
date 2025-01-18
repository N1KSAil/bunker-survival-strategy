import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PlayerStatusProps {
  name: string;
  health: number;
  maxHealth: number;
}

export const PlayerStatus = ({ name, health, maxHealth }: PlayerStatusProps) => {
  const healthPercentage = (health / maxHealth) * 100;
  
  return (
    <Card className="bg-bunker-accent p-4 text-bunker-text">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">{name}</h3>
          <span className="text-sm">{health}/{maxHealth} HP</span>
        </div>
        <Progress 
          value={healthPercentage} 
          className="h-2 bg-bunker-bg"
          indicatorClassName={`${
            healthPercentage > 66 ? "bg-bunker-success" :
            healthPercentage > 33 ? "bg-bunker-warning" :
            "bg-bunker-danger"
          }`}
        />
      </div>
    </Card>
  );
};