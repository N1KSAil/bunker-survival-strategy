import { useState, useEffect, useRef } from "react";

export const useProgress = (isLoading: boolean, isAuthChecking: boolean) => {
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    let progressTimer: number | undefined;

    if (isAuthChecking || isLoading) {
      setProgress(0);
      progressTimer = window.setInterval(() => {
        setProgress((oldProgress) => {
          if (!isMounted.current) return oldProgress;
          return Math.min(oldProgress + 5, 95);
        });
      }, 50);
    } else {
      setProgress(100);
    }

    return () => {
      isMounted.current = false;
      if (progressTimer) {
        window.clearInterval(progressTimer);
      }
    };
  }, [isAuthChecking, isLoading]);

  return progress;
};