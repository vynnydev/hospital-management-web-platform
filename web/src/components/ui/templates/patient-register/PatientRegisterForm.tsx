'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card'
import { Button } from '@/components/ui/organisms/button'
import { useToast } from '@/components/ui/hooks/use-toast'
import { AlertCircle, Loader2 } from 'lucide-react'
import { authService } from '@/services/auth/AuthService'

// Importação dos componentes de passos
import { StepOne } from './steps/StepOne'
import { StepTwo } from './steps/StepTwo'
import { StepThree } from './steps/StepThree'
import { StepFour } from './steps/StepFour'
import { TPermission, TRole } from '@/types/auth-types'

// Interface para o formulário de cadastro de paciente
export interface IPatientFormData {
  // Dados pessoais
  name: string
  email: string
  password: string
  confirmPassword: string
  cpf: string
  dateOfBirth: string
  gender: 'masculino' | 'feminino' | 'outro' | ''
  phoneNumber: string
  
  // Endereço
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  
  // Informações de saúde
  healthInsurance: string
  insuranceNumber: string
  insuranceExpiration: string
  emergencyContactName: string
  emergencyContactPhone: string
  allergies: string
  chronicConditions: string
  
  // Termos e preferências
  hasAcceptedTerms: boolean
  hasAcceptedPrivacyPolicy: boolean
  receiveNotifications: boolean
  allowDataSharing: boolean
}

// Componente principal de cadastro
export const PatientRegisterForm = () => {
  const router = useRouter()
  const { toast } = useToast()
  
  // Estado para controlar o passo atual
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<IPatientFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    healthInsurance: '',
    insuranceNumber: '',
    insuranceExpiration: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '',
    chronicConditions: '',
    
    hasAcceptedTerms: false,
    hasAcceptedPrivacyPolicy: false,
    receiveNotifications: true,
    allowDataSharing: false
  })
  
  // Função para atualizar o formData quando os inputs mudarem
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }
  
  // Funções para navegar entre os passos
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }
  
  // Validação por passo
  const validateStep = () => {
    if (currentStep === 1) {
      // Validar dados pessoais
      if (!formData.name) {
        toast({
          title: "Nome é obrigatório",
          description: "Por favor, informe seu nome completo",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.email) {
        toast({
          title: "Email é obrigatório",
          description: "Por favor, informe um email válido",
          variant: "destructive"
        })
        return false
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Email inválido",
          description: "Por favor, informe um email válido",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.password) {
        toast({
          title: "Senha é obrigatória",
          description: "Por favor, crie uma senha",
          variant: "destructive"
        })
        return false
      }
      
      if (formData.password.length < 6) {
        toast({
          title: "Senha muito curta",
          description: "A senha deve ter pelo menos 6 caracteres",
          variant: "destructive"
        })
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Senhas não conferem",
          description: "As senhas informadas não são iguais",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.cpf) {
        toast({
          title: "CPF é obrigatório",
          description: "Por favor, informe seu CPF",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.dateOfBirth) {
        toast({
          title: "Data de nascimento é obrigatória",
          description: "Por favor, informe sua data de nascimento",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.phoneNumber) {
        toast({
          title: "Telefone é obrigatório",
          description: "Por favor, informe um número de telefone para contato",
          variant: "destructive"
        })
        return false
      }
    }
    
    if (currentStep === 2) {
      // Validar endereço
      if (!formData.zipCode) {
        toast({
          title: "CEP é obrigatório",
          description: "Por favor, informe seu CEP",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.street) {
        toast({
          title: "Rua é obrigatória",
          description: "Por favor, informe o nome da rua",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.number) {
        toast({
          title: "Número é obrigatório",
          description: "Por favor, informe o número do seu endereço",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.neighborhood) {
        toast({
          title: "Bairro é obrigatório",
          description: "Por favor, informe o bairro",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.city) {
        toast({
          title: "Cidade é obrigatória",
          description: "Por favor, informe a cidade",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.state) {
        toast({
          title: "Estado é obrigatório",
          description: "Por favor, selecione o estado",
          variant: "destructive"
        })
        return false
      }
    }
    
    if (currentStep === 3) {
      // Validar informações médicas - contato de emergência obrigatório
      if (!formData.emergencyContactName) {
        toast({
          title: "Nome do contato de emergência é obrigatório",
          description: "Por favor, informe um contato de emergência",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.emergencyContactPhone) {
        toast({
          title: "Telefone do contato de emergência é obrigatório",
          description: "Por favor, informe o telefone do contato de emergência",
          variant: "destructive"
        })
        return false
      }
    }
    
    if (currentStep === 4) {
      // Validar termos e condições
      if (!formData.hasAcceptedTerms) {
        toast({
          title: "Termos de Uso",
          description: "É necessário aceitar os Termos de Uso para continuar",
          variant: "destructive"
        })
        return false
      }
      
      if (!formData.hasAcceptedPrivacyPolicy) {
        toast({
          title: "Política de Privacidade",
          description: "É necessário aceitar a Política de Privacidade para continuar",
          variant: "destructive"
        })
        return false
      }
    }
    
    return true
  }
  
  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep()) return
    
    if (currentStep < 4) {
      goToNextStep()
      return
    }
    
    try {
      setIsSubmitting(true)
      
    // Preparar dados para o cadastro
    const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'paciente' as TRole, // Adicione type assertion aqui
        permissions: ['PATIENT_ACCESS', 'SCHEDULE_APPOINTMENTS', 'VIEW_OWN_RECORDS', 'REQUEST_TELEMEDICINE'] as TPermission[],
        dateOfBirth: formData.dateOfBirth,
        healthInsurance: formData.healthInsurance,
        // Criar um ID de paciente com base no email (em produção, seria gerado pelo backend)
        patientId: `PTH-${Math.floor(Math.random() * 10000)}`,
        // Dados adicionais que serão armazenados em outro local ou tabela
        additionalData: {
        address: {
            zipCode: formData.zipCode,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state
        },
        contactInfo: {
            phoneNumber: formData.phoneNumber,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactPhone: formData.emergencyContactPhone
        },
        healthInfo: {
            allergies: formData.allergies,
            chronicConditions: formData.chronicConditions,
            insuranceNumber: formData.insuranceNumber,
            insuranceExpiration: formData.insuranceExpiration
        },
        preferences: {
            receiveNotifications: formData.receiveNotifications,
            allowDataSharing: formData.allowDataSharing
        }
        }
    };
      
      // Em um ambiente real, esse seria o endpoint de cadastro
      await authService.createUser(userData)
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode entrar no sistema com seu email e senha.",
        variant: "default"
      })
      
      // Redirecionar para a página de login após o cadastro
      router.push('/login')
    } catch (error) {
      console.error('Erro no cadastro:', error)
      
      toast({
        title: "Erro ao realizar cadastro",
        description: "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen py-8 px-4 bg-gradient-to-b from-gray-900 to-blue-900">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            Cadastro de Paciente
          </CardTitle>
          <CardDescription>
            {currentStep === 1
              ? "Informações pessoais"
              : currentStep === 2
              ? "Informações de endereço"
              : currentStep === 3
              ? "Informações de saúde"
              : "Termos e preferências"
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Indicador de progresso */}
            <div className="w-full flex mb-6">
              <div className="w-full flex items-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex-1 relative">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      } mx-auto`}
                    >
                      {step}
                    </div>
                    
                    {step < 4 && (
                      <div 
                        className={`absolute top-4 w-full h-0.5 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                    
                    <p className={`text-xs text-center mt-2 ${
                      currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step === 1 
                        ? "Pessoal" 
                        : step === 2 
                        ? "Endereço" 
                        : step === 3 
                        ? "Saúde" 
                        : "Termos"
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Passos do formulário */}
            {currentStep === 1 && (
              <StepOne formData={formData} handleChange={handleChange} />
            )}
            
            {currentStep === 2 && (
              <StepTwo formData={formData} handleChange={handleChange} />
            )}
            
            {currentStep === 3 && (
              <StepThree formData={formData} handleChange={handleChange} />
            )}
            
            {currentStep === 4 && (
              <StepFour formData={formData} handleChange={handleChange} />
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 1 || isSubmitting}
              >
                Voltar
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-700 to-cyan-700 hover:to-blue-800`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : currentStep < 4 ? (
                  "Continuar"
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            </div>
            
            {/* Mensagem de alerta para dados obrigatórios */}
            <div className="text-sm text-gray-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
              Campos marcados com * são obrigatórios
            </div>
            
            {/* Link para página de login */}
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                  Entre aqui
                </a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}