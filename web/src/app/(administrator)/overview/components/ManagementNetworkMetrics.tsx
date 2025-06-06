/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/organisms/button";
import { Card, CardContent } from "@/components/ui/organisms/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/organisms/select";
import { 
  Monitor, 
  Users, 
  Building2, 
  Bed, 
  ChevronDown,
  Activity,
  Map,
  Settings,
  Puzzle,
  LayoutGrid,
  Edit3,
  X,
  Sparkles,
  Brain,
  LogIn
} from 'lucide-react';
import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';
import { ConfigurationAndUserModalMenus } from '@/components/ui/templates/modals/ConfigurationAndUserModalMenus';
import { Button as PrimaryButton } from '@/components/ui/organisms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/organisms/dialog';
import { authService } from '@/services/general/auth/AuthService';
import { Alert } from "@/components/ui/organisms/alert";
import { AlertCircle } from 'lucide-react';
import { useUserMetrics } from '@/hooks/user/metrics/useUserMetrics';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { EditableMetricsPanel } from '@/components/ui/templates/hospital-metrics/EditableMetricsPanel';
import { MetricManager } from '@/components/ui/templates/hospital-metrics/MetricManager';

// Importar o componente de gestão avançada de métricas
import { AdvancedMetricsManagement } from '@/components/ui/templates/ai-metrics/AdvancedMetricsManagement';

interface IHospitalMetrics {
  unit: {
    state: string;
    name?: string;
  };
}

interface ICurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface IManagementNetworkMetricsProps {
  networkData: INetworkData;
  filteredHospitals: IHospital[];
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
  displayMode: "dashboard" | "tv";
  currentMetrics: ICurrentMetrics;
  canChangeRegion: boolean | undefined;

  // FOR FullscreenModeModal TO DepartmentStatus
  selectedHospital: string | null,
  getStatusColor: (status: "normal" | "attention" | "critical") => string

  // FOR Analitics TO DepartmentStatus
  getFilteredHospitals: () => IHospital[]

  // NetworkListHospital and HospitalsLocations
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>

  // Reposicionamento dos componentes
  isReorderMode?: boolean;
  setIsReorderMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ManagementNetworkMetrics: React.FC<IManagementNetworkMetricsProps> = ({
  networkData,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  filteredHospitals,
  canChangeRegion,
  selectedHospital,
  setSelectedHospital,
  getFilteredHospitals
}) => {
  const [activeSection, setActiveSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [defaultSection, setDefaultSection] = useState<string>('integrations');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Estado para o modo de edição de métricas
  const [isEditMetricsMode, setIsEditMetricsMode] = useState(false);
  
  // Estado para modal avançado de métricas (substituindo o antigo isAIGenerationModalOpen)
  const [isAdvancedMetricsModalOpen, setIsAdvancedMetricsModalOpen] = useState(false);
  
  // Referência para o componente de métricas para ajustar o blur
  const metricsContainerRef = useRef<HTMLDivElement>(null);
  
  // Hook para métricas de usuário
  const { 
    isAuthenticated, 
    isLoading, 
    error,
    refreshMetrics,
    panelMetrics
  } = useUserMetrics();
  
  // Hook para permissões
  const { isAdmin, isHospitalManager } = usePermissions();
  
  // Verificar se usuário está autenticado
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsUserLoggedIn(isAuth);
    };
    
    checkAuth();
    
    // Listener para mudanças de autenticação
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  // Verificar se há métricas salvas
  const hasMetrics = panelMetrics.length > 0;
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setDefaultSection('integrations');
  };

  const regionHospitals = React.useMemo(() => { 
    if (!networkData?.hospitals?.length) return {};
    
    return networkData.hospitals.reduce<Record<string, { id: string, name: string }[]>>((acc, hospital) => {
      const state = hospital?.unit?.state;
      if (!state) return acc;
      
      if (!acc[state]) {
        acc[state] = [];
      }
      
      acc[state].push({
        id: hospital.id,
        name: hospital.name
      });
      
      return acc;
    }, {});
  }, [networkData?.hospitals]);
  
  // Extrair apenas a lista de regiões (estados)
  const regions = React.useMemo(() => {
    return Object.keys(regionHospitals);
  }, [regionHospitals]);

  // Função para alternar o modo de edição de métricas
  const toggleEditMetricsMode = () => {
    if (!isUserLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    
    setIsEditMetricsMode(!isEditMetricsMode);
    
    if (!isEditMetricsMode) {
      refreshMetrics();
    }
  };
  
  // Abrir modal de gerenciamento de métricas
  const openMetricsManager = () => {
    if (!isUserLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    
    setIsManagerModalOpen(true);
  };
  
  // Abrir modal avançado de métricas (substituindo a função anterior)
  const openAdvancedMetricsModal = () => {
    if (!isUserLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    
    setIsAdvancedMetricsModalOpen(true);
  };
  
  // Função para fazer login
  const handleLogin = async () => {
    try {
      await authService.login({
        email: 'admin@4health.com',
        password: '123'
      });
      
      setIsLoginModalOpen(false);
      refreshMetrics();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  // Função para lidar com a mudança na seleção de região/hospital
  const handleRegionOrHospitalChange = (value: string) => {
    // Verificar se o valor é um ID de hospital ou uma região
    const isHospitalId = !['all', ...regions].includes(value);
    
    if (isHospitalId) {
      setSelectedHospital(value);
      
      // Encontrar a região (estado) do hospital selecionado
      for (const [region, hospitals] of Object.entries(regionHospitals)) {
        if (hospitals.some(h => h.id === value)) {
          setSelectedRegion(region);
          break;
        }
      }
    } else {
      setSelectedRegion(value);
      setSelectedHospital(null);
    }
  };

  return (
    <>    
      <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-6 relative">
        <CardContent className="p-0">
          <div className="flex flex-col space-y-6">
            {/* Network Info Section */}
            <div className="flex justify-between items-start">
              <div className="flex flex-row space-x-4">
                <div className='space-y-2'>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {networkData?.networkInfo?.name || 'Rede Hospitalar'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {filteredHospitals?.length || 0} Hospitais • {currentMetrics?.totalBeds || 0} Leitos
                  </p>
                </div>

                {/* Deixar mostrando no maximo 5 com o plus */}
                <div>
                  <IntegrationsPreviewPressable onSelectIntegration={handleOpenModal} hgt='10' wth='10' />

                  <ConfigurationAndUserModalMenus 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    defaultSection={defaultSection}
                    user={null}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Botão de login/usuário */}
                {!isUserLoggedIn ? (
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    variant="outline"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700"
                  >
                    <LogIn size={18} className="mr-1" />
                    <span>Entrar</span>
                  </Button>
                ) : (
                  <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-indigo-800 dark:text-indigo-300 text-sm">
                    {authService.getCurrentUser()?.name || 'Usuário'}
                  </div>
                )}
                
                {/* Botão para gerar métricas com IA - atualizado para usar o novo componente */}
                <Button
                  onClick={openAdvancedMetricsModal}
                  className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-cyan-700 hover:from-indigo-600 hover:to-teal-500 text-white border-none rounded-full py-3 px-6 font-semibold shadow-lg transition-all duration-300 ease-in-out"
                  disabled={!isUserLoggedIn}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-full"></div>
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles size={20} className="text-white/90" />
                    <span className="text-md">Métricas Avançadas</span>
                  </div>
                </Button>
                
                {/* Botão para gerenciar métricas */}
                <Button
                  onClick={openMetricsManager}
                  variant="outline"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                  disabled={!isUserLoggedIn}
                >
                  <Settings size={18} className="mr-1" />
                  <span>Gerenciar Métricas</span>
                </Button>
                
                {/* Botão para editar métricas */}
                <Button
                  onClick={toggleEditMetricsMode}
                  variant="outline"
                  className={`
                    flex items-center space-x-2 
                    ${isEditMetricsMode 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700' 
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }
                  `}
                  disabled={!isUserLoggedIn && !isEditMetricsMode}
                >
                  {isEditMetricsMode ? (
                    <>
                      <X size={18} />
                      <span>Sair do modo de edição</span>
                    </>
                  ) : (
                    <>
                      <Edit3 size={18} className="text-gray-500 dark:text-gray-400" />
                      <span>Editar Métricas</span>
                    </>
                  )}
                </Button>

                {canChangeRegion && (
                  <div className="relative">
                    <Select 
                      value={selectedHospital || selectedRegion} 
                      onValueChange={handleRegionOrHospitalChange}
                    >
                      <SelectTrigger className="w-64 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-2">
                          <Map size={18} className="text-gray-500 dark:text-gray-400" />
                          <SelectValue placeholder="Selecione a região" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {/* Item para todas as regiões */}
                        <SelectItem value="all">
                          <div className="flex items-center space-x-2">
                            <Users size={18} className="text-gray-500 dark:text-gray-400" />
                            <span>Todas as Regiões</span>
                          </div>
                        </SelectItem>

                        {/* Lista de regiões com estados */}
                        {regions.map(region => (
                          <React.Fragment key={region}>
                            {/* Cabeçalho da região */}
                            <SelectItem value={region} className='bg-gray-200 dark:bg-gray-700'>
                              <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700">
                                <Map size={18} className="text-gray-500 dark:text-gray-400" />
                                <span className='bg-gray-200 dark:bg-gray-700'>Unidades - {region}</span>
                              </div>
                            </SelectItem>
                            
                            {/* Hospitais da região */}
                            {regionHospitals[region]?.map(hospital => (
                              <SelectItem key={hospital.id} value={hospital.id} className='bg-gray-200 dark:bg-gray-700'>
                                <div className="flex items-center space-x-2 pl-6 ">
                                  <Building2 size={16} className="text-gray-500 dark:text-gray-400" />
                                  <span className=''>Unidade - {hospital.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Área de métricas editáveis - Aqui fica o conteúdo principal */}
            <div className="relative" ref={metricsContainerRef}>
              <EditableMetricsPanel 
                networkData={networkData}
                currentMetrics={currentMetrics}
                selectedRegion={selectedRegion}
                selectedHospital={selectedHospital}
                isEditMode={isEditMetricsMode}
                onExitEditMode={() => setIsEditMetricsMode(false)}
                getFilteredHospitals={getFilteredHospitals}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Login */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-gray-200 dark:bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Login necessário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Faça login para gerenciar suas métricas
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 text-indigo-300 text-sm">
              <p className="font-medium">Demo: Credenciais pré-configuradas</p>
              <p className="mt-1">Email: admin@4health.com</p>
              <p>Senha: 123</p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Clique em Login para continuar</span>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleLogin}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Gerenciamento de Métricas */}
      <Dialog open={isManagerModalOpen} onOpenChange={setIsManagerModalOpen}>
        <DialogContent className="max-w-5xl bg-gray-200 dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Gerenciador de Métricas</DialogTitle>
            <DialogDescription>
              Gerencie todas as métricas do sistema, padrão e personalizadas
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-[70vh] overflow-y-auto">
            <MetricManager />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagerModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Novo componente para gestão avançada de métricas */}
      <AdvancedMetricsManagement 
        isOpen={isAdvancedMetricsModalOpen}
        onClose={() => setIsAdvancedMetricsModalOpen(false)}
        networkData={networkData}
        selectedHospital={selectedHospital}
        currentMetrics={currentMetrics}
      />
    </>
  );
};