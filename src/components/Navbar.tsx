import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar = ({ isAuthenticated }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex justify-end p-4">
      {isAuthenticated ? (
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="text-bunker-text hover:text-bunker-text/80"
        >
          Выйти
        </Button>
      ) : (
        <Button 
          onClick={() => navigate("/")}
          variant="outline"
          className="text-bunker-text hover:text-bunker-text/80"
        >
          Войти / Регистрация
        </Button>
      )}
    </div>
  );
};

export default Navbar;