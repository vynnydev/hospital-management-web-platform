'use client'

import { IPatientFormData } from '../PatientRegisterForm'
import { Label } from '@/components/ui/organisms/label'
import { Checkbox } from '@/components/ui/organisms/checkbox'
import { FileText, ShieldCheck, Bell, Share2 } from 'lucide-react'

interface IStepFourProps {
  formData: IPatientFormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function StepFour({ formData, handleChange }: IStepFourProps) {
  // Função para manipular checkboxes
  const handleCheckboxChange = (name: string) => {
    const event = {
      target: {
        name,
        type: 'checkbox',
        checked: !formData[name as keyof IPatientFormData]
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    handleChange(event)
  }
  
  return (
    <div className="space-y-6">
      {/* Termos de uso */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-start mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold">Termos de Uso</h3>
            <p className="text-sm text-gray-600">
              Por favor, leia com atenção os termos antes de aceitar.
            </p>
          </div>
        </div>
        
        <div className="h-40 overflow-y-auto p-4 border border-gray-200 rounded-md bg-white mb-4 text-sm">
          <h4 className="font-medium mb-2">Termos de Uso da Plataforma Cognitiva</h4>
          <p className="mb-2">
            Bem-vindo à Plataforma Cognitiva, um serviço de telemedicina que oferece consultas médicas online, agendamento de consultas, acesso a prontuários e receitas médicas digitais.
          </p>
          <p className="mb-2">
            Ao utilizar nossos serviços, você concorda com estes termos. Por favor, leia-os cuidadosamente.
          </p>
          <h5 className="font-medium mt-4 mb-1">1. Serviços Oferecidos</h5>
          <p className="mb-2">
            A Plataforma Cognitiva oferece consultas médicas online, agendamento de consultas, acesso a prontuários e receitas médicas digitais, entre outros serviços de telemedicina.
          </p>
          <h5 className="font-medium mt-4 mb-1">2. Cadastro e Conta</h5>
          <p className="mb-2">
            Para utilizar nossos serviços, é necessário criar uma conta com informações verdadeiras e completas. Você é responsável por manter a confidencialidade de sua senha e pela atividade em sua conta.
          </p>
          <h5 className="font-medium mt-4 mb-1">3. Limitações do Serviço</h5>
          <p className="mb-2">
            A telemedicina não substitui atendimentos presenciais em casos de emergência. Em situações graves, procure imediatamente um serviço de emergência.
          </p>
          <h5 className="font-medium mt-4 mb-1">4. Responsabilidades</h5>
          <p className="mb-2">
            As informações fornecidas através da plataforma não constituem aconselhamento médico definitivo e não estabelecem uma relação médico-paciente completa.
          </p>
          <h5 className="font-medium mt-4 mb-1">5. Alterações nos Termos</h5>
          <p className="mb-2">
            Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas.
          </p>
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="hasAcceptedTerms"
            checked={formData.hasAcceptedTerms}
            onCheckedChange={() => handleCheckboxChange('hasAcceptedTerms')}
          />
          <Label htmlFor="hasAcceptedTerms" className="ml-2 cursor-pointer">
            Eu li e aceito os Termos de Uso *
          </Label>
        </div>
      </div>
      
      {/* Política de privacidade */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-start mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold">Política de Privacidade</h3>
            <p className="text-sm text-gray-600">
              Como tratamos seus dados pessoais e informações de saúde.
            </p>
          </div>
        </div>
        
        <div className="h-40 overflow-y-auto p-4 border border-gray-200 rounded-md bg-white mb-4 text-sm">
          <h4 className="font-medium mb-2">Política de Privacidade da Plataforma Cognitiva</h4>
          <p className="mb-2">
            A Plataforma Cognitiva está comprometida em proteger sua privacidade e dados pessoais. Esta política explica como coletamos, usamos e protegemos suas informações.
          </p>
          <h5 className="font-medium mt-4 mb-1">1. Coleta de Dados</h5>
          <p className="mb-2">
            Coletamos informações que você fornece ao se cadastrar e utilizar nossos serviços, incluindo dados pessoais e informações de saúde necessárias para o atendimento médico.
          </p>
          <h5 className="font-medium mt-4 mb-1">2. Uso das Informações</h5>
          <p className="mb-2">
            Utilizamos suas informações para fornecer serviços de telemedicina, processar pagamentos, melhorar nossos serviços e cumprir obrigações legais.
          </p>
          <h5 className="font-medium mt-4 mb-1">3. Proteção de Dados</h5>
          <p className="mb-2">
            Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração.
          </p>
          <h5 className="font-medium mt-4 mb-1">4. Compartilhamento</h5>
          <p className="mb-2">
            Suas informações podem ser compartilhadas com profissionais de saúde envolvidos em seu atendimento, sempre respeitando o sigilo médico e a confidencialidade.
          </p>
          <h5 className="font-medium mt-4 mb-1">5. Seus Direitos</h5>
          <p className="mb-2">
            Você tem direito a acessar, corrigir, excluir e portar seus dados, além de retirar consentimentos previamente fornecidos.
          </p>
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="hasAcceptedPrivacyPolicy"
            checked={formData.hasAcceptedPrivacyPolicy}
            onCheckedChange={() => handleCheckboxChange('hasAcceptedPrivacyPolicy')}
          />
          <Label htmlFor="hasAcceptedPrivacyPolicy" className="ml-2 cursor-pointer">
            Eu li e aceito a Política de Privacidade *
          </Label>
        </div>
      </div>
      
      {/* Preferências */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Preferências de Comunicação</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Checkbox
              id="receiveNotifications"
              checked={formData.receiveNotifications}
              onCheckedChange={() => handleCheckboxChange('receiveNotifications')}
            />
            <div className="ml-3">
              <Label htmlFor="receiveNotifications" className="font-medium cursor-pointer">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-blue-600" />
                  Receber notificações
                </div>
              </Label>
              <p className="text-sm text-gray-600">
                Lembretes de consultas, resultados de exames e dicas de saúde.
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Checkbox
              id="allowDataSharing"
              checked={formData.allowDataSharing}
              onCheckedChange={() => handleCheckboxChange('allowDataSharing')}
            />
            <div className="ml-3">
              <Label htmlFor="allowDataSharing" className="font-medium cursor-pointer">
                <div className="flex items-center">
                  <Share2 className="mr-2 h-4 w-4 text-blue-600" />
                  Compartilhamento de dados anônimos
                </div>
              </Label>
              <p className="text-sm text-gray-600">
                Ajude-nos a melhorar nossos serviços compartilhando dados anônimos para pesquisa.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 text-sm">
        <p className="text-gray-600">
          Os itens marcados com * são obrigatórios para finalizar seu cadastro.
        </p>
      </div>
    </div>
  )
}