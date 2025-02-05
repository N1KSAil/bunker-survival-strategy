import { ReactNode } from "react";
import Navbar from "./Navbar";

interface MainContainerProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

const MainContainer = ({ children, isAuthenticated }: MainContainerProps) => {
  return (
    <div className="min-h-screen bg-bunker-bg text-bunker-text">
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4 space-y-6">
        {children}
      </div>
    </div>
  );
};

export default MainContainer;