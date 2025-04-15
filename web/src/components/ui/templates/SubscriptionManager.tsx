'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutTemplate, 
  CreditCard, 
  BarChart, 
  ArrowRight,
  DownloadCloud,
  Building
} from 'lucide-react'

// Importar componentes do shadcn/ui
import { Button } from '@/components/ui/organisms/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs'

import { useSubscription } from '@/hooks/subscription/useSubscription'
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData'
import { useAuth } from '@/hooks/auth/useAuth'

import { PlanSelectionTab } from './subscription/tabs/PlanSelectionTab'
import { ModuleConfigurationTab } from './subscription/tabs/ModuleConfigurationTab'
import { PaymentHistoryTab } from './subscription/tabs/PaymentHistoryTab'
import { UsageStatisticsTab } from './subscription/tabs/UsageStatisticsTab'
import { HospitalSelector } from './HospitalSelector'

export const SubscriptionManager = () => {
  const router = useRouter()
  const { networkData, currentUser } = useNetworkData()
  const { user, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("plans") // Default tab é planos e assinaturas

  const previousHospitalId = useRef<string | undefined>(undefined);
  
  // Estado para o hospital selecionado
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | undefined>(
    currentUser?.hospitalId || user?.hospitalId
  )
  
  // Obtenha o hospital selecionado
  const selectedHospital = networkData?.hospitals?.find(h => h.id === selectedHospitalId)
  
  // Use o hook de assinatura para o hospital selecionado
  const { 
    loading, 
    error,
    refreshData
  } = useSubscription(selectedHospitalId)
  
  // Quando o hospital mudar, recarregue os dados
  useEffect(() => {
    if (selectedHospitalId && selectedHospitalId !== previousHospitalId.current) {
      previousHospitalId.current = selectedHospitalId;
      refreshData();
    }
  }, [selectedHospitalId]);
  
  // Handler para quando o hospital selecionado mudar
  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId)
  }
  
  // Renderizar componente de carregamento
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
        <h3 className="font-medium">Erro ao carregar dados</h3>
        <p>{error}</p>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho do gerenciador com seletor de hospital */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Plano e Assinatura
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4 lg:mb-0">
              Gerencie seu plano, assinatura e configurações de módulos
            </p>
          </div>
          
          {/* Seletor de hospital */}
          {hasPermission('VIEW_ALL_HOSPITALS') && (
            <HospitalSelector 
              onHospitalChange={handleHospitalChange}
              selectedHospitalId={selectedHospitalId}
              className="w-full lg:w-auto"
            />
          )}
        </div>
        
        {/* Exibir o hospital atual quando o usuário não pode alterar */}
        {!hasPermission('VIEW_ALL_HOSPITALS') && selectedHospital && (
          <div className="flex items-center mt-2">
            <Building className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedHospital.name}
            </span>
          </div>
        )}
      </div>
      
      {/* Conteúdo principal com tabs - usando shadcn/ui Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg">
            <TabsTrigger 
              value="plans" 
              className="flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              <span>Planos e Assinaturas</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="modules" 
              className="flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
            >
              <LayoutTemplate className="w-5 h-5 mr-2" />
              <span>Configuração de Módulos</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="payments" 
              className="flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
            >
              <DownloadCloud className="w-5 h-5 mr-2" />
              <span>Histórico de Pagamentos</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="stats" 
              className="flex items-center justify-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow"
            >
              <BarChart className="w-5 h-5 mr-2" />
              <span>Estatísticas de Uso</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="plans">
              <PlanSelectionTab hospitalId={selectedHospitalId} />
            </TabsContent>
            
            <TabsContent value="modules">
              <ModuleConfigurationTab hospitalId={selectedHospitalId} />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentHistoryTab hospitalId={selectedHospitalId} />
            </TabsContent>
            
            <TabsContent value="stats">
              <UsageStatisticsTab hospitalId={selectedHospitalId} />
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Botões de ação */}
        <div className="mt-6 flex justify-between">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
          >
            Voltar
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => router.push('/fale-conosco')}
              variant="outline"
              className="border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
            >
              Fale com um Consultor
            </Button>
            
            <Button
              onClick={() => router.push('/central-de-ajuda/planos')}
              variant="secondary"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Central de Ajuda
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}