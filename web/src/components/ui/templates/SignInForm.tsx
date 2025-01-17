'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { authService } from '@/services/auth/AuthService';
import { useToast } from "@/components/ui/hooks/use-toast";

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response?.user?.permissions.includes('VIEW_ALL_HOSPITALS')) {
        console.log("Entrou aqui - VIEW_ALL_HOSPITALS:", email, password)
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para a página inicial...",
          variant: "default",
          duration: 5000,
        });
        router.push('/overview');
      } else if (response?.user?.permissions.includes('VIEW_SINGLE_HOSPITAL') && response.user.hospitalId) {
        console.log("Entrou aqui - VIEW_SINGLE_HOSPITAL:", email, password)
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para a página do hospital...",
          variant: "default",
          duration: 5000,
        });
        router.push(`/overview/${response.user.hospitalId}`);
      } else {
        console.log("Entrou aqui - Erro de permissão:", email, password)
        toast({
          title: "Erro de permissão",
          description: "Usuário sem permissões necessárias.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (err) {
      toast({
        title: "Erro de login",
        description: "Erro ao fazer login. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Card className="w-[400px] dark:bg-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Entrar no Sistema</CardTitle>
        <CardDescription className="text-center">
          Por favor, entre para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="exemplo@rededor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2">
        <div className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <a href="/sign-up" className="text-primary hover:underline">
            Cadastre-se
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}