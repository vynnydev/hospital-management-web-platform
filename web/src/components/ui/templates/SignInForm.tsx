'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/organisms/button'
import { Input } from '@/components/ui/organisms/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card'
import { useAuth } from '@/services/hooks/auth/useAuth'
import { useToast } from "@/components/ui/hooks/use-toast"

export const SignInForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const showSuccessToast = (message: string) => {
    toast({
      title: "Login bem-sucedido!",
      description: message,
      variant: "default",
      duration: 1500,
    })
  }

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration: 3000,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      showErrorToast(
        "Campos obrigatórios", 
        "Por favor, preencha todos os campos."
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await login(email, password)

      if (!response?.user) {
        throw new Error('Resposta inválida do servidor')
      }

      const userRole = response.user.role
      const { permissions } = response.user

      // Redirecionamento baseado no tipo de usuário
      if (userRole === 'administrador' && permissions.includes('VIEW_ALL_HOSPITALS')) {
        showSuccessToast("Redirecionando para o painel administrativo...")
        router.push('/overview')
      } 
      else if (userRole === 'administrador' && permissions.includes('VIEW_SINGLE_HOSPITAL') && response.user.hospitalId) {
        showSuccessToast("Redirecionando para o painel do hospital...")
        router.push('/overview')
      }
      else if (userRole === 'médico' && permissions.includes('DOCTOR_ACCESS')) {
        showSuccessToast("Redirecionando para o painel médico...")
        router.push('/doctor-dashboard')
      }
      else if (userRole === 'paciente' && permissions.includes('PATIENT_ACCESS')) {
        showSuccessToast("Redirecionando para sua área de paciente...")
        router.push('/patient-dashboard')
      }
      else if (userRole === 'enfermeiro' && permissions.includes('NURSE_ACCESS')) {
        showSuccessToast("Redirecionando para área de enfermagem...")
        router.push('/nurse-dashboard')
      }
      else if (userRole === 'atendente' && permissions.includes('ATTENDANT_ACCESS')) {
        showSuccessToast("Redirecionando para área de atendimento...")
        router.push('/attendant-dashboard')
      }
      else {
        showErrorToast(
          "Erro de permissão",
          "Usuário sem permissões necessárias para acessar o sistema."
        )
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      showErrorToast(
        "Erro de login",
        `Não foi possível realizar o login. ${errorMessage}`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-b from-gray-900 to-blue-900 p-4">
      <div className="w-full max-w-md mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Bem vindo de volta!</h1>
        </div>
        
        <Card className="w-full dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Entrar no Sistema</CardTitle>
            <CardDescription className="text-center">
              Por favor, entre para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
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
                <div className="text-right">
                  <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Esqueceu a senha?
                  </a>
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
          <CardFooter className="flex flex-col items-center justify-center space-y-3">
            
            <div className="w-full border-t border-gray-700 my-2"></div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">É um paciente ?</p>
              <a href="/patient-register">
                <Button
                  variant="outline"
                  className="w-full mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  Registre-se como paciente
                </Button>
              </a>
              <p className="text-sm text-gray-500 mt-4">
                Crie sua conta para acessar nossos serviços de telemedicina
              </p>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2025 Plataforma Cognitiva - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}