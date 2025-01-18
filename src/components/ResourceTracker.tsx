import { Card } from "@/components/ui/card";

interface Resource {
  name: string;
  amount: number;
  icon: string;
}

interface ResourceTrackerProps {
  resources: Resource[];
  onResourceChange?: (resourceName: string, amount: number) => void;
}

export const ResourceTracker = ({ resources, onResourceChange }: ResourceTrackerProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mx-auto p-4">
      {resources.map((resource) => (
        <Card key={resource.name} className="bg-bunker-accent p-4 text-bunker-text">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-2xl">{resource.icon}</span>
            <h3 className="font-bold">{resource.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onResourceChange?.(resource.name, -1)}
                className="px-2 py-1 bg-bunker-danger rounded hover:opacity-80 transition-opacity"
              >
                -
              </button>
              <span className="text-xl font-bold min-w-[3ch] text-center">{resource.amount}</span>
              <button
                onClick={() => onResourceChange?.(resource.name, 1)}
                className="px-2 py-1 bg-bunker-success rounded hover:opacity-80 transition-opacity"
              >
                +
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};