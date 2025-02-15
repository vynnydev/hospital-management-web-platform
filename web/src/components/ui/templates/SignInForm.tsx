'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { authService } from '@/services/auth/AuthService';
import { useToast } from "@/components/ui/hooks/use-toast";

type UserPermissions = 'VIEW_ALL_HOSPITALS' | 'VIEW_SINGLE_HOSPITAL';

interface AuthResponse {
  user?: {
    permissions: UserPermissions[];
    hospitalId?: string;
  };
  error?: string;
}

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const showSuccessToast = (message: string) => {
    toast({
      title: "Login bem-sucedido!",
      description: message,
      variant: "default",
      duration: 1500, // Reduzido para 3s para melhor UX
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration: 3000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showErrorToast(
        "Campos obrigatórios", 
        "Por favor, preencha todos os campos."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({ email, password }) as AuthResponse;

      if (!response?.user) {
        throw new Error('Resposta inválida do servidor');
      }

      const { permissions, hospitalId } = response.user;

      if (permissions.includes('VIEW_ALL_HOSPITALS')) {
        showSuccessToast("Redirecionando para a página inicial...");
        router.push('/overview');
      } else if (permissions.includes('VIEW_SINGLE_HOSPITAL') && hospitalId) {
        showSuccessToast("Redirecionando para a página do hospital...");
        router.push('/overview');
      } else {
        showErrorToast(
          "Erro de permissão",
          "Usuário sem permissões necessárias para acessar o sistema."
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showErrorToast(
        "Erro de login",
        `Não foi possível realizar o login. ${errorMessage}`
      );
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
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@rededor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Senha</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <a href="/sign-up" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">
            Cadastre-se
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}