import { useState, useEffect, useRef } from "react";

export const useProgress = (isLoading: boolean, isAuthChecking: boolean) => {
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<number>();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isAuthChecking || isLoading) {
      setProgress(0);
      if (progressTimer.current) {
        window.clearInterval(progressTimer.current);
      }
      progressTimer.current = window.setInterval(() => {
        if (!isMounted.current) return;
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 20, 95); // Увеличиваем скорость в 2 раза
          if (newProgress === 95) {
            if (progressTimer.current) {
              window.clearInterval(progressTimer.current);
            }
          }
          return newProgress;
        });
      }, 25); // Уменьшаем интервал в 2 раза
    } else {
      if (progressTimer.current) {
        window.clearInterval(progressTimer.current);
      }
      setProgress(100);
    }

    return () => {
      isMounted.current = false;
      if (progressTimer.current) {
        window.clearInterval(progressTimer.current);
      }
    };
  }, [isAuthChecking, isLoading]);

  return progress;
};