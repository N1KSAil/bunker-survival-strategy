import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Неверный email или пароль');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Пожалуйста, подтвердите ваш email');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("Успешный вход в аккаунт!");
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Этот email уже зарегистрирован');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("Регистрация успешна! Проверьте вашу почту.");
        onSuccess();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error('Произошла ошибка при аутентификации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="bg-bunker-bg border-bunker-accent"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          minLength={6}
          className="bg-bunker-bg border-bunker-accent"
        />
      </div>
      <Button 
        type="submit"
        disabled={loading}
        className="w-full bg-bunker-success hover:bg-bunker-success/90"
      >
        {loading ? "Загрузка..." : (isLogin ? "Войти" : "Зарегистрироваться")}
      </Button>
      <Button 
        type="button"
        variant="link"
        onClick={() => setIsLogin(!isLogin)}
        className="w-full"
      >
        {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
      </Button>
    </form>
  );
};

export default AuthForm;