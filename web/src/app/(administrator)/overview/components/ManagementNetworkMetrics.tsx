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
import { authService } from '@/services/auth/AuthService';
import { Alert } from "@/components/ui/organisms/alert";
import { AlertCircle } from 'lucide-react';
import { useUserMetrics } from '@/services/hooks/user/metrics/useUserMetrics';
import { usePermissions } from '@/services/hooks/auth/usePermissions';
import { EditableMetricsPanel } from '@/components/ui/templates/hospital-metrics/EditableMetricsPanel';
import { MetricManager } from '@/components/ui/templates/hospital-metrics/MetricManager';

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
}) => {
  const [activeSection, setActiveSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [defaultSection, setDefaultSection] = useState<string>('integrations');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Estado para o modo de edição de métricas
  const [isEditMetricsMode, setIsEditMetricsMode] = useState(false);
  const [isAIGenerationModalOpen, setIsAIGenerationModalOpen] = useState(false);
  
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

  const regions = React.useMemo(() => { 
    if (!networkData?.hospitals?.length) return [];
    
    return networkData.hospitals.reduce<string[]>((acc: string[], hospital: { unit: { state: string } }) => {
      if (!acc.includes(hospital?.unit?.state)) {
        acc.push(hospital.unit.state);
      }
      return acc;
    }, [] as string[]);
  }, [networkData?.hospitals]);

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
  
  // Abrir modal de geração de métricas com IA
  const openAIGenerationModal = () => {
    if (!isUserLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    
    setIsAIGenerationModalOpen(true);
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
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
                  >
                    <LogIn size={18} className="mr-1" />
                    <span>Entrar</span>
                  </Button>
                ) : (
                  <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-800 dark:text-blue-300 text-sm">
                    {authService.getCurrentUser()?.name || 'Usuário'}
                  </div>
                )}
                
                {/* Botão para gerar métricas com IA */}
                <Button
                  onClick={openAIGenerationModal}
                  variant="outline"
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300 dark:border-purple-800"
                  disabled={!isUserLoggedIn}
                >
                  <Brain size={18} className="mr-1" />
                  <span>IA Generativa</span>
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
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700' 
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
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
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
                          <SelectItem key={region} value={region} className='bg-gray-200 dark:bg-gray-700'>
                            <div className="flex items-center space-x-2">
                              <Map size={18} className="text-gray-500 dark:text-gray-400" />
                              <span>Unidades - {region}</span>
                            </div>
                          </SelectItem>
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
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Login */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Login necessário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Faça login para gerenciar suas métricas
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 text-blue-300 text-sm">
              <p className="font-medium">Demo: Credenciais pré-configuradas</p>
              <p className="mt-1">Email: admin@4health.com</p>
              <p>Senha: 123</p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Clique em Login para continuar</span>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
        <DialogContent className="max-w-5xl">
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
      
      {/* Modal de Geração de Métricas com IA */}
      <Dialog open={isAIGenerationModalOpen} onOpenChange={setIsAIGenerationModalOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="h-5 w-5 text-purple-500 mr-2" />
              Assistente IA Generativa
            </DialogTitle>
            <DialogDescription>
              Gere métricas personalizadas através de diálogo interativo com a IA
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-[70vh] overflow-y-auto">
            <iframe 
              src="/studio-de-processos/ia-generativa" 
              className="w-full h-full border-none"
              title="IA Generativa"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIGenerationModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};