import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen = ({ progress }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <p className="text-center mb-4">Проверка авторизации...</p>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
};

export default LoadingScreen;