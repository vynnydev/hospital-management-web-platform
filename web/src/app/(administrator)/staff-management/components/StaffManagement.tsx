/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, PieChart, TrendingUp, TrendingDown, 
  AlertCircle, RefreshCw, Calendar, CheckCircle2 
} from 'lucide-react';
import { StaffViewListMenuBar } from '@/components/ui/templates/StaffViewListMenuBar';
import type { ViewType } from '@/types/app-types';
import type { 
  IStaffTeam, 
  IDepartmentalStaffMetrics,
  TTeamStatus 
} from '@/types/staff-types';
import type { TFontSize } from '@/types/utils-types';
import { getDepartmentData, normalizeDepartmentName } from '@/utils/patientDataUtils';
import { IHospitalMetrics } from '@/types/hospital-network-types';
import { StaffBoard } from './StaffBoard';
import { StaffListView } from './StaffListView';
import { StaffCardModal } from './StaffCardModal';
import { StaffCalendar } from './StaffCalendar';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';

interface StaffManagementProps {
    data: IHospitalMetrics | undefined;
    departmentMetrics: IDepartmentalStaffMetrics;
    teams: IStaffTeam[];
    selectedArea: string;
    onSelectTeam: (team: IStaffTeam | null) => void;
    departments: Record<string, string[]>;
    onClose: () => void;
    fontSize: TFontSize;
    setFontSize: (size: TFontSize) => void;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
}

// Componente de card de métrica adaptado para equipes
const StaffMetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; trend: 'up' | 'down' };
  loading: boolean;
  subtitle?: string;
  color?: string;
}> = ({ title, value, icon, trend, loading, subtitle, color = 'primary' }) => (
  <div className={`relative overflow-hidden bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg 
                 transition-all duration-300 hover:shadow-xl border-l-4 border-${color}`}>
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 bg-${color}/10 dark:bg-${color}/20 rounded-lg`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <span className={trend.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trend.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </span>
          )}
        </div>
      </>
    )}
  </div>
);

export const StaffManagement: React.FC<StaffManagementProps> = ({
    data,
    departmentMetrics,
    teams,
    selectedArea,
    onSelectTeam,
    departments,
    onClose,
    fontSize,
    setFontSize,
    loading,
    error,
    onRetry
}) => {
    // Estados
    const { currentUser } = useNetworkData()
    const [currentView, setCurrentView] = useState<ViewType>('board');
    const [filteredTeams, setFilteredTeams] = useState<IStaffTeam[]>(teams);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<IStaffTeam | null>(null);
    const [isChangingView, setIsChangingView] = useState(false);

    // Utilitários e verificações de departamento
    const normalizedArea = selectedArea ? normalizeDepartmentName(selectedArea) : '';
    const departmentData = selectedArea ? getDepartmentData(data, selectedArea) : null;
    const isDepartmentAvailable = selectedArea && departmentData;

    // Estados para gerar analises o para os profissionais e seus times com IA
    const [analyticsData, setAnalyticsData] = useState<Record<string, any>>({});
    const [analyticsProgress, setAnalyticsProgress] = useState(0);

    // Efeito para filtrar equipes baseado na busca
    useEffect(() => {
        let result = teams;
        
        if (searchQuery) {
        result = result.filter(team => 
            team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.id.includes(searchQuery) ||
            team.specialties.some(spec => 
            spec.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        }
        
        setFilteredTeams(result);
    }, [teams, searchQuery]);

    // Handlers
    // Quando mudar de view, vamos resetar o selectedTeam para o modal não abrir na mudança de aba
    const handleViewChange = (view: ViewType) => {
        setIsChangingView(true); // Indica que está mudando de view
        setCurrentView(view);
        
        switch (view) {
        case 'board':
            setSearchQuery('');
            setSelectedTeam(null); // Limpa a seleção ao mudar para board
            break;
        case 'list':
            setSelectedTeam(null); // Limpa a seleção ao mudar para list
            break;
        case 'calendar':
            // Mantém o selectedPatient apenas para o calendário
            break;
        }

        // Reseta o estado após um pequeno delay para garantir que a transição seja suave
        setTimeout(() => {
        setIsChangingView(false);
        }, 100);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleTeamSelect = (team: IStaffTeam | null) => {
        console.log('Selecting team in StaffManagement:', team);
        setSelectedTeam(team);
        if (onSelectTeam) onSelectTeam(team);
    };

    useEffect(() => {
        console.log('Selected team changed:', selectedTeam);
    }, [selectedTeam]);

    // Cálculos de métricas
    const calculateShiftCoverage = (): { value: number; trend: 'up' | 'down' } => {
        const { shiftCoverage } = departmentMetrics;
        const average = (shiftCoverage.morning + shiftCoverage.afternoon + shiftCoverage.night) / 3;
        return {
        value: Math.round(average),
        trend: average > 90 ? 'up' : 'down' as const  // Usando "as const" para garantir o tipo literal
        };
    };

    const calculateStaffDistribution = () => {
        const { staffDistribution } = departmentMetrics;
        return {
            total: staffDistribution.doctors + staffDistribution.nurses + staffDistribution.technicians,
            doctors: staffDistribution.doctors,
            nurses: staffDistribution.nurses,
            technicians: staffDistribution.technicians
        };
    };

    const renderMetricsCards = () => {
        const staffDist = calculateStaffDistribution();
        const coverageMetric = calculateShiftCoverage();
        
        return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StaffMetricCard
                title="Profissionais em Serviço"
                value={`${departmentMetrics.onDuty}/${departmentMetrics.totalStaff}`}
                subtitle={`${staffDist.doctors} médicos, ${staffDist.nurses} enfermeiros`}
                icon={<Users className="w-6 h-6 text-primary" />}
                loading={loading}
                color="primary"
            />
            <StaffMetricCard
                title="Cobertura de Turnos"
                value={`${coverageMetric.value}%`}
                subtitle="Média de todos os turnos"
                icon={<Clock className="w-6 h-6 text-blue-500" />}
                trend={coverageMetric}
                loading={loading}
                color="blue"
            />
            <StaffMetricCard
                title="Taxa de Conclusão"
                value={`${departmentMetrics.taskCompletion}%`}
                subtitle={`Tempo médio: ${departmentMetrics.averageTaskTime}min`}
                icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
                loading={loading}
                color="green"
            />
        </div>
        );
    };

    // Função para gerar analises para os profissionais e seus times com IA (modificar a função)
    const handleGenerateAnalytics = async (team: IStaffTeam) => {
        try {
            setAnalyticsProgress(0);
            // Aqui você implementaria a lógica real de geração de análises
            // Por enquanto, vamos simular um progresso
            for (let i = 0; i <= 100; i += 20) {
                setAnalyticsProgress(i);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Simula dados de análise gerados
            setAnalyticsData(prev => ({
                ...prev,
                [team.id]: {
                    performance: Math.random() * 100,
                    efficiency: Math.random() * 100,
                    recommendations: [
                        'Otimizar distribuição de tarefas',
                        'Revisar escala de turnos',
                        'Considerar treinamento adicional'
                    ]
                }
            }));
        } catch (error) {
            console.error('Erro ao gerar análise:', error);
        } finally {
            setAnalyticsProgress(100);
        }
    };

    const renderNoAreaSelected = () => (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 
                        rounded-xl p-8 text-center shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                    <AlertCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Selecione um departamento
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Escolha um departamento para visualizar informações detalhadas e gerenciar pacientes
                </p>
            </div>
        </div>
    );

    console.log("Time selecionado do StaffManagement:", selectedTeam)

    return (
        <div className="flex flex-col bg-gradient-to-r from-blue-700 to-cyan-700 py-1 rounded-xl">
            <div className="flex-1 p-4 space-y-4 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl">
                <div className={`flex flex-col ${error ? 'opacity-50' : ''}`}>
                    <StaffViewListMenuBar
                        currentView={currentView}
                        onViewChange={handleViewChange}
                        onSearch={handleSearch}
                    />

                    {/* Área principal com altura flexível */}
                    {isDepartmentAvailable && departmentData ? (
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            {currentView === 'board' ? (
                                <>
                                {renderMetricsCards()}               
                                    <StaffBoard
                                        data={data}
                                        departmentMetrics={departmentMetrics}
                                        selectedArea={normalizedArea}
                                        teams={filteredTeams}
                                        searchQuery={searchQuery}
                                        setSelectedTeam={handleTeamSelect} // Mantém essa linha
                                        analyticsData={analyticsData}
                                        isLoading={loading}
                                        loadingMessage="Gerando análise..."
                                        loadingProgress={analyticsProgress}
                                        generateAnalytics={handleGenerateAnalytics}
                                    />
                                </>
                            ) : currentView === 'list' ? (
                                <>             
                                    {renderMetricsCards()}                
                                    <StaffListView
                                        teams={teams} 
                                        onSelectTeam={handleTeamSelect}
                                        selectedTeam={selectedTeam}
                                        departmentMetrics={departmentMetrics}
                                        fontSize={fontSize}
                                        analyticsData={analyticsData}
                                        isLoading={loading}
                                        onGenerateAnalytics={handleGenerateAnalytics}
                                    />
                                </>
                            ) : currentView === 'calendar' ? (
                                <div className="mt-0">
                                    <StaffCalendar 
                                        teams={teams} 
                                        currentUser={currentUser} 
                                        selectedTeam={selectedTeam} // Passamos o selectedTeam
                                        onSelectTeam={handleTeamSelect} // Passamos nossa função de handler
                                    />
                                </div>
                            ) : null}
                            </div>
                        ) : (
                            <>            
                                {renderMetricsCards()}
                                {renderNoAreaSelected()}
                            </>
                        )}
                    </div>

                    {/* Adicionar o Modal aqui */}
                    {selectedTeam && currentView !== 'calendar' && !isChangingView && (
                        <StaffCardModal
                            selectedTeam={selectedTeam}
                            setSelectedTeam={setSelectedTeam}
                            departmentMetrics={departmentMetrics}
                            isHighContrast={false}
                            fontSize={fontSize}
                            analyticsData={analyticsData}
                            isLoading={loading}
                            onGenerateAnalytics={handleGenerateAnalytics}
                        />
                    )}

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 
                                        rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-4 
                                        w-full max-w-2xl mx-auto">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <div>
                                    <h3 className="font-medium text-red-500">Erro ao carregar dados</h3>
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            </div>
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 
                                        text-white text-sm rounded-md transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Tentar novamente</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};