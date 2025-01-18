import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PlayerStatusProps {
  name: string;
  health: number;
  maxHealth: number;
}

export const PlayerStatus = ({ name, health, maxHealth }: PlayerStatusProps) => {
  const healthPercentage = (health / maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 66) return "bg-bunker-success";
    if (healthPercentage > 33) return "bg-bunker-warning";
    return "bg-bunker-danger";
  };
  
  return (
    <Card className="bg-bunker-accent p-4 text-bunker-text">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">{name}</h3>
          <span className="text-sm">{health}/{maxHealth} HP</span>
        </div>
        <Progress 
          value={healthPercentage} 
          className={`h-2 bg-bunker-bg [&>div]:${getHealthColor()}`}
        />
      </div>
    </Card>
  );
};