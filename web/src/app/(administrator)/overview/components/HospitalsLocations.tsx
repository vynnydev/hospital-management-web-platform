import React, { useState, useEffect } from 'react';
import { MapboxHospital } from '../../../../components/ui/templates/map/MapboxHospital';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { Building2, MapPin, AlertTriangle, Activity, TrendingUp, Truck, Layers, Zap } from 'lucide-react';
import { useHospitalAdvancedData } from '@/services/hooks/useHospitalAdvancedData';

interface IHospitalsLocationsProps {
  hospitals: IHospital[];
  currentUser: IAppUser | null;
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>;
}

// Menu de funcionalidades
type TViewMode = 'overview' | 'resources' | 'transfers' | 'emergency' | 'predictions' | 'staffing';

export const HospitalsLocations: React.FC<IHospitalsLocationsProps> = ({
  hospitals,
  currentUser,
  selectedHospital,
  setSelectedHospital
}) => {
  // Estado para controlar o modo de visualização
  const [viewMode, setViewMode] = useState<TViewMode>('overview');
  
  // Carregar dados avançados
  const { 
    resourcesData, 
    emergencyData, 
    predictiveData,
    loading: advancedDataLoading 
  } = useHospitalAdvancedData();

  // Filtrar hospitais baseado nas permissões do usuário
  const filteredHospitals = currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')
    ? hospitals
    : hospitals.filter(hospital => hospital.id === currentUser?.hospitalId);

  // Selecionar o primeiro hospital por padrão
  useEffect(() => {
    if (filteredHospitals.length > 0 && !selectedHospital) {
      setSelectedHospital(filteredHospitals[0].id);
    }
  }, [filteredHospitals, selectedHospital, setSelectedHospital]);

  // Componente para exibir as opções de visualização
  const ViewModeSelector = () => (
    <div className="absolute top-4 right-4 z-30 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2">
      <div className="flex flex-col space-y-2">
        <button 
          className={`p-2 rounded-md flex items-center ${viewMode === 'overview' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          onClick={() => setViewMode('overview')}
        >
          <Layers className="h-5 w-5 mr-2" />
          <span>Visão Geral</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center ${viewMode === 'resources' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          onClick={() => setViewMode('resources')}
        >
          <Truck className="h-5 w-5 mr-2" />
          <span>Recursos</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center ${viewMode === 'transfers' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          onClick={() => setViewMode('transfers')}
        >
          <Activity className="h-5 w-5 mr-2" />
          <span>Transferências</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center ${viewMode === 'emergency' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          onClick={() => setViewMode('emergency')}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Emergências</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center ${viewMode === 'predictions' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          onClick={() => setViewMode('predictions')}
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          <span>Previsões</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center ${viewMode === 'staffing' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
          onClick={() => setViewMode('staffing')}
        >
          <Zap className="h-5 w-5 mr-2" />
          <span>Equipes</span>
        </button>
      </div>
    </div>
  );

  // Renderização condicional com base no modo de visualização
  const renderHospitalDetails = (hospital: IHospital) => {
    if (advancedDataLoading) {
      return (
        <div className="animate-pulse flex flex-col space-y-3 p-3">
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
        </div>
      );
    }
    
    // Dados do hospital selecionado
    const resources = resourcesData?.resources[hospital.id];
    const predictions = predictiveData?.predictions[hospital.id];
    
    switch (viewMode) {
      case 'resources':
        return resources ? (
          <div className="p-3 space-y-4">
            <div>
              <h4 className="text-blue-300 text-sm font-medium mb-2">Equipamentos</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <p className="text-xs text-gray-300">Respiradores</p>
                  <p className="text-white">{resources.equipmentStatus.respirators.available}/{resources.equipmentStatus.respirators.total}</p>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <p className="text-xs text-gray-300">Monitores</p>
                  <p className="text-white">{resources.equipmentStatus.monitors.available}/{resources.equipmentStatus.monitors.total}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-green-300 text-sm font-medium mb-2">Leitos</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">UTI</span>
                  <span className={`text-sm font-medium ${
                    resources.bedStatus.icu.available < 5 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {resources.bedStatus.icu.available}/{resources.bedStatus.icu.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Emergência</span>
                  <span className={`text-sm font-medium ${
                    resources.bedStatus.emergency.available < 5 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {resources.bedStatus.emergency.available}/{resources.bedStatus.emergency.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Geral</span>
                  <span className="text-sm font-medium text-green-400">
                    {resources.bedStatus.general.available}/{resources.bedStatus.general.total}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-yellow-300 text-sm font-medium mb-2">Suprimentos</h4>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-gray-300 text-sm">Críticos: {resources.suppliesStatus.medications.criticalLow + resources.suppliesStatus.bloodBank.criticalLow + resources.suppliesStatus.ppe.criticalLow}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-gray-300 text-sm">Baixo Estoque: {resources.suppliesStatus.medications.lowStock + resources.suppliesStatus.bloodBank.lowStock + resources.suppliesStatus.ppe.lowStock}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-300 text-sm">Normal: {resources.suppliesStatus.medications.normal + resources.suppliesStatus.bloodBank.normal + resources.suppliesStatus.ppe.normal}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <p className="text-gray-400">Dados de recursos não disponíveis</p>
          </div>
        );

      case 'transfers':
        return resources?.transferRequests ? (
          <div className="p-3 space-y-3">
            <h4 className="text-blue-300 text-sm font-medium">Requisições de Transferência</h4>
            {resources.transferRequests.length > 0 ? (
              resources.transferRequests.map(req => (
                <div key={req.patientId} className="bg-gray-700/50 p-2 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm">{req.patientId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      req.severity === 'high' ? 'bg-red-500/30 text-red-200' :
                      req.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                      'bg-green-500/30 text-green-200'
                    }`}>
                      {req.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">Especialidade: {req.requiredSpecialty}</p>
                  <p className="text-xs text-gray-400">{new Date(req.requestTime).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Nenhuma requisição pendente</p>
            )}
            
            <button className="w-full mt-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md text-sm flex items-center justify-center">
              <span>Nova Transferência</span>
            </button>
          </div>
        ) : (
          <div className="p-3">
            <p className="text-gray-400">Dados de transferência não disponíveis</p>
          </div>
        );

      case 'predictions':
        return predictions ? (
          <div className="p-3 space-y-4">
            <div>
              <h4 className="text-purple-300 text-sm font-medium mb-2">Previsão de Pacientes</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-700/50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-300">24h</p>
                  <p className="text-white font-medium">{predictions.expectedPatientInflow.next24h}</p>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-300">48h</p>
                  <p className="text-white font-medium">{predictions.expectedPatientInflow.next48h}</p>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-300">7 dias</p>
                  <p className="text-white font-medium">{predictions.expectedPatientInflow.next7d}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-blue-300 text-sm font-medium mb-2">Necessidade de Recursos</h4>
              <div className="space-y-2">
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">UTI</span>
                    <div className="flex items-center">
                      <span className="text-white mr-2">{predictions.resourceNeeds.icu.current} → {predictions.resourceNeeds.icu.predicted}</span>
                      {predictions.resourceNeeds.icu.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                      {predictions.resourceNeeds.icu.trend === 'decreasing' && <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />}
                      {predictions.resourceNeeds.icu.trend === 'stable' && <span className="h-px w-4 bg-blue-400 block" />}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Emergência</span>
                    <div className="flex items-center">
                      <span className="text-white mr-2">{predictions.resourceNeeds.emergency.current} → {predictions.resourceNeeds.emergency.predicted}</span>
                      {predictions.resourceNeeds.emergency.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                      {predictions.resourceNeeds.emergency.trend === 'decreasing' && <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />}
                      {predictions.resourceNeeds.emergency.trend === 'stable' && <span className="h-px w-4 bg-blue-400 block" />}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Geral</span>
                    <div className="flex items-center">
                      <span className="text-white mr-2">{predictions.resourceNeeds.general.current} → {predictions.resourceNeeds.general.predicted}</span>
                      {predictions.resourceNeeds.general.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                      {predictions.resourceNeeds.general.trend === 'decreasing' && <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />}
                      {predictions.resourceNeeds.general.trend === 'stable' && <span className="h-px w-4 bg-blue-400 block" />}
                    </div>
                    </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-yellow-300 text-sm font-medium mb-2">Fatores Sazonais</h4>
              <div className="space-y-2">
                {predictions.seasonalFactors.map((factor, index) => (
                  <div key={index} className="bg-gray-700/50 p-2 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-gray-200 capitalize">{factor.factor.replace('_', ' ')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        factor.impact === 'high' ? 'bg-red-500/30 text-red-200' :
                        factor.impact === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                        'bg-green-500/30 text-green-200'
                      }`}>
                        {factor.impact}
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-600/50 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-blue-400" 
                        style={{ width: `${factor.probability * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-400 mt-0.5">{Math.round(factor.probability * 100)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <p className="text-gray-400">Dados preditivos não disponíveis</p>
          </div>
        );

      case 'emergency':
        return emergencyData ? (
          <div className="p-3 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-red-300 text-sm font-medium">Alertas Ativos</h4>
                <span className="bg-red-500/30 text-red-200 text-xs px-2 py-0.5 rounded-full">
                  {emergencyData.alerts.filter(a => a.status === 'active').length}
                </span>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {emergencyData.alerts.map(alert => (
                  <div key={alert.id} className={`p-2 rounded-md ${
                    alert.status === 'active' ? 'bg-red-900/30 border border-red-500/30' : 'bg-gray-700/50'
                  }`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm capitalize">{alert.type.replace('_', ' ')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-500/30 text-red-200' :
                        alert.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                        'bg-green-500/30 text-green-200'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {alert.location.address}
                    </p>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      <span className="text-orange-300">{alert.estimatedVictims} vítimas est.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-blue-300 text-sm font-medium mb-2">Recursos de Emergência</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-700/50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-300">Ambulâncias</p>
                  <p className="text-white font-medium">{emergencyData.resourceDeployment.availableAmbulances}</p>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-300">Helicópteros</p>
                  <p className="text-white font-medium">{emergencyData.resourceDeployment.availableHelicopters}</p>
                </div>
                <div className="bg-gray-700/50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-300">Equipes</p>
                  <p className="text-white font-medium">{emergencyData.resourceDeployment.responderTeams}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-green-300 text-sm font-medium mb-2">Tempo Estimado de Resposta</h4>
              {hospital.id in emergencyData.resourceDeployment.estimatedResponseTimes ? (
                <div className="bg-gray-700/50 p-3 rounded-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {emergencyData.resourceDeployment.estimatedResponseTimes[hospital.id]}
                  </span>
                  <span className="text-sm text-gray-300 ml-2">minutos</span>
                </div>
              ) : (
                <p className="text-gray-400 text-center">Não disponível</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3">
            <p className="text-gray-400">Dados de emergência não disponíveis</p>
          </div>
        );

      case 'staffing':
        const bottlenecks = predictiveData?.networkAnalysis.bottlenecks.filter(
          b => b.hospital === hospital.id
        );
        
        const staffReallocations = predictiveData?.networkAnalysis.optimalResourceDistribution.staffReallocation.filter(
          r => r.from === hospital.id || r.to === hospital.id
        );
        
        return (
          <div className="p-3 space-y-4">
            <div>
              <h4 className="text-purple-300 text-sm font-medium mb-2">Alocação de Pessoal</h4>
              {staffReallocations && staffReallocations.length > 0 ? (
                <div className="space-y-2">
                  {staffReallocations.map((reallocation, index) => (
                    <div key={index} className="bg-gray-700/50 p-2 rounded-md">
                      <div className="flex items-center">
                        <div className={`flex-1 text-sm ${reallocation.from === hospital.id ? 'text-red-300' : 'text-green-300'}`}>
                          {reallocation.from === hospital.id ? 'Saída' : 'Entrada'}
                        </div>
                        <div className="flex-1 text-right text-white font-medium">
                          {reallocation.count} profissionais
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 mt-1 capitalize">
                        Especialidade: {reallocation.specialty?.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {reallocation.from === hospital.id 
                          ? `Para: Hospital ${reallocation.to.replace('hospital-', '')}`
                          : `De: Hospital ${reallocation.from.replace('hospital-', '')}`
                        }
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Nenhuma realocação necessária</p>
              )}
            </div>
            
            {bottlenecks && bottlenecks.length > 0 && (
              <div>
                <h4 className="text-red-300 text-sm font-medium mb-2">Gargalos Identificados</h4>
                <div className="space-y-2">
                  {bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="bg-gray-700/50 p-2 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-white capitalize">{bottleneck.department.replace('_', ' ')}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          bottleneck.severity === 'high' ? 'bg-red-500/30 text-red-200' :
                          bottleneck.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                          'bg-green-500/30 text-green-200'
                        }`}>
                          {bottleneck.severity}
                        </span>
                      </div>
                      <p className="text-sm text-red-300 mt-1 capitalize">
                        {bottleneck.issue.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {hospital.id in (resourcesData?.resources || {}) && (
              <div>
                <h4 className="text-blue-300 text-sm font-medium mb-2">Status da Equipe</h4>
                <button className="w-full mt-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md text-sm flex items-center justify-center">
                  <span>Ver Escala Completa</span>
                </button>
              </div>
            )}
          </div>
        );

      default: // overview
        return (
          <div className="p-3 space-y-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-white">
                  Hospital {hospital.name}
                </h3>
                <div className="flex items-center text-sm text-gray-300">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{hospital.unit.city}, {hospital.unit.state}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Ocupação</span>
                <span className={`text-sm font-medium ${
                  hospital.metrics.overall.occupancyRate > 80 
                    ? 'text-red-400' 
                    : hospital.metrics.overall.occupancyRate > 60 
                      ? 'text-yellow-400' 
                      : 'text-green-400'
                }`}>
                  {hospital.metrics.overall.occupancyRate}%
                </span>
              </div>
              
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    hospital.metrics.overall.occupancyRate > 80 
                      ? 'bg-red-400' 
                      : hospital.metrics.overall.occupancyRate > 60 
                        ? 'bg-yellow-400' 
                        : 'bg-green-400'
                  }`}
                  style={{ width: `${hospital.metrics.overall.occupancyRate}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Recursos</span>
                <span className="text-sm font-medium text-blue-400">
                  {hospital.metrics.overall.availableBeds}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Equipe Ativa</span>
                <span className="text-sm font-medium text-purple-400">
                  {hospital.networkRank?.efficiency || 0}
                </span>
              </div>
            </div>
            
            {/* Quick stats from advanced data */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {resourcesData?.resources[hospital.id] && (
                <div className="bg-blue-900/20 p-2 rounded-md">
                  <p className="text-xs text-gray-300">Leitos UTI</p>
                  <p className="text-lg font-medium text-blue-300">
                    {resourcesData.resources[hospital.id].bedStatus.icu.available}/{resourcesData.resources[hospital.id].bedStatus.icu.total}
                  </p>
                </div>
              )}
              
              {emergencyData?.alerts.some(a => a.status === 'active') && (
                <div className="bg-red-900/20 p-2 rounded-md">
                  <p className="text-xs text-gray-300">Alertas</p>
                  <p className="text-lg font-medium text-red-300">
                    {emergencyData.alerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
              )}
              
              {predictiveData?.predictions[hospital.id] && (
                <div className="bg-purple-900/20 p-2 rounded-md">
                  <p className="text-xs text-gray-300">Previsão 24h</p>
                  <p className="text-lg font-medium text-purple-300">
                    {predictiveData.predictions[hospital.id].expectedPatientInflow.next24h}
                  </p>
                </div>
              )}
              
              {resources?.transferRequests && (
                <div className="bg-green-900/20 p-2 rounded-md">
                  <p className="text-xs text-gray-300">Transferências</p>
                  <p className="text-lg font-medium text-green-300">
                    {resources.transferRequests.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  // Componente da lista de hospitais
  const HospitalsList = () => (
    <div className="space-y-0.5 overflow-y-auto">
      {filteredHospitals.map(hospital => (
        <div
          key={hospital.id}
          className={`cursor-pointer transition-all duration-200 ${
            selectedHospital === hospital.id
              ? 'bg-gray-700/90'
              : 'bg-gray-800/70 hover:bg-gray-700/50'
          }`}
          onClick={() => setSelectedHospital(hospital.id)}
        >
          {selectedHospital === hospital.id ? (
            renderHospitalDetails(hospital)
          ) : (
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white truncate mr-2">
                  {hospital.name}
                </h3>
                <span className={`text-sm font-medium ${
                  hospital.metrics.overall.occupancyRate > 80 
                    ? 'text-red-400' 
                    : hospital.metrics.overall.occupancyRate > 60 
                      ? 'text-yellow-400' 
                      : 'text-green-400'
                }`}>
                  {hospital.metrics.overall.occupancyRate}%
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{hospital.unit.city}, {hospital.unit.state}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-9rem)] bg-gray-900 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Lista de Hospitais */}
      <div className="absolute left-4 top-4 bottom-4 w-80 bg-gray-800/80 backdrop-blur-sm z-20 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Hospitais da Rede</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
          <HospitalsList />
        </div>
      </div>

      {/* Seletor de Modo de Visualização */}
      <ViewModeSelector />

      {/* Mapa */}
      <div className="absolute inset-0 w-full h-full z-10">
        <MapboxHospital
          hospitals={filteredHospitals}
          selectedHospital={selectedHospital}
          setSelectedHospital={setSelectedHospital}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};