/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Thermometer, 
  Droplet, 
  Stethoscope, 
  Tablet, 
  RefreshCw, 
  AlertCircle, 
  Activity, 
  MessageSquare,
  Bed,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { Alert, useAlerts } from '../../../providers/alerts/AlertsProvider';

interface ResourceMonitorProps {
  hospitalId: string;
  onStartChat?: (resourceType: string, departmentId: string) => void;
  className?: string;
}

// Interface para dados de recursos
interface ResourceData {
  id: string;
  name: string;
  department: string;
  status: 'normal' | 'warning' | 'critical';
  current: number;
  total: number;
  unit: string;
  icon: React.ReactNode;
}

// Interface para recursos agrupados por departamento
interface DepartmentResources {
  [department: string]: ResourceData[];
}

/**
 * Componente que monitora e exibe o status de recursos hospitalares
 */
export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({
  hospitalId,
  onStartChat,
  className = ''
}) => {
  const { networkData } = useNetworkData();
  const { addCustomAlert } = useAlerts();
  
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
  const [resourcesData, setResourcesData] = useState<DepartmentResources>({});

  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (networkData) {
      loadResourcesData();
    }
  }, [networkData, hospitalId]);

  // Simulação de carregamento de dados de recursos
  const loadResourcesData = () => {
    setLoading(true);
    
    // Em um ambiente real, esses dados viriam da API
    // Simulando dados com um timeout
    setTimeout(() => {
      const mockResourcesData: DepartmentResources = {
        'UTI': [
          {
            id: 'uti-vent-01',
            name: 'Ventiladores',
            department: 'UTI',
            status: 'warning',
            current: 2,
            total: 10,
            unit: 'unid',
            icon: <Activity className="h-4 w-4" />
          },
          {
            id: 'uti-bed-01',
            name: 'Leitos Disponíveis',
            department: 'UTI',
            status: 'critical',
            current: 1,
            total: 8,
            unit: 'leitos',
            icon: <Bed className="h-4 w-4" />
          },
          {
            id: 'uti-staff-01',
            name: 'Equipe de Enfermagem',
            department: 'UTI',
            status: 'normal',
            current: 5,
            total: 6,
            unit: 'enfermeiros',
            icon: <Users className="h-4 w-4" />
          },
          {
            id: 'uti-equipment-01',
            name: 'Monitores Cardíacos',
            department: 'UTI',
            status: 'normal',
            current: 8,
            total: 10,
            unit: 'unid',
            icon: <Activity className="h-4 w-4" />
          }
        ],
        'Enfermaria': [
          {
            id: 'enf-bed-01',
            name: 'Leitos Disponíveis',
            department: 'Enfermaria',
            status: 'warning',
            current: 5,
            total: 20,
            unit: 'leitos',
            icon: <Bed className="h-4 w-4" />
          },
          {
            id: 'enf-staff-01',
            name: 'Equipe de Enfermagem',
            department: 'Enfermaria',
            status: 'critical',
            current: 3,
            total: 8,
            unit: 'enfermeiros',
            icon: <Users className="h-4 w-4" />
          },
          {
            id: 'enf-equipment-01',
            name: 'Oxímetros',
            department: 'Enfermaria',
            status: 'normal',
            current: 15,
            total: 20,
            unit: 'unid',
            icon: <Droplet className="h-4 w-4" />
          }
        ],
        'Centro Cirúrgico': [
          {
            id: 'cc-room-01',
            name: 'Salas Disponíveis',
            department: 'Centro Cirúrgico',
            status: 'normal',
            current: 3,
            total: 4,
            unit: 'salas',
            icon: <Stethoscope className="h-4 w-4" />
          },
          {
            id: 'cc-staff-01',
            name: 'Anestesistas',
            department: 'Centro Cirúrgico',
            status: 'warning',
            current: 1,
            total: 3,
            unit: 'médicos',
            icon: <Users className="h-4 w-4" />
          }
        ]
      };
      
      setResourcesData(mockResourcesData);
      setLoading(false);
      setLastUpdate(new Date());
      
      // Expandir departamentos com recursos críticos por padrão
      const criticalDepartments = Object.entries(mockResourcesData)
        .filter(([_, resources]) => resources.some(r => r.status === 'critical'))
        .map(([dept]) => dept);
      
      setExpandedDepartments(criticalDepartments);
      
      // Verificar recursos críticos e criar alertas
      Object.values(mockResourcesData).flat().forEach(resource => {
        if (resource.status === 'critical') {
          const newAlert: Omit<Alert, 'id' | 'timestamp' | 'read'> = {
            type: 'resource',
            title: `${resource.name} em estado crítico`,
            message: `${resource.name} em ${resource.department}: ${resource.current} de ${resource.total} ${resource.unit} disponíveis.`,
            priority: 'high',
            actionRequired: true,
            metadata: {
              resourceId: resource.id,
              resourceName: resource.name,
              department: resource.department,
              current: resource.current,
              total: resource.total
            }
          };
          
          addCustomAlert(newAlert);
        }
      });
    }, 1500);
  };

  // Função para atualizar dados manualmente
  const refreshData = () => {
    loadResourcesData();
  };

  // Alternar expansão de um departamento
  const toggleDepartment = (department: string) => {
    setExpandedDepartments(prev => 
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  // Iniciar um chat sobre recursos de um departamento
  const handleStartChat = (resourceType: string, departmentId: string) => {
    if (onStartChat) {
      onStartChat(resourceType, departmentId);
    }
  };

  // Calcular estatísticas gerais
  const calculateStats = () => {
    const allResources = Object.values(resourcesData).flat();
    const totalCritical = allResources.filter(r => r.status === 'critical').length;
    const totalWarning = allResources.filter(r => r.status === 'warning').length;
    const totalNormal = allResources.filter(r => r.status === 'normal').length;
    
    return { totalCritical, totalWarning, totalNormal };
  };

  const stats = calculateStats();

  // Estado de carregamento
  if (loading && Object.keys(resourcesData).length === 0) {
    return (
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-20 text-gray-400 dark:text-gray-500">
          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
          Carregando dados de recursos...
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[1000px] ${className}`}>
      {/* Cabeçalho */}
      <div className="p-3 border-b dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20 flex justify-between items-center">
        <h3 className="font-medium text-amber-900 dark:text-amber-100 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-amber-700 dark:text-amber-400" />
          Monitor de Recursos
        </h3>
        
        <button 
          className={`p-1.5 rounded-full text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/50 ${loading ? 'animate-spin' : ''}`}
          onClick={refreshData}
          disabled={loading}
          title="Atualizar dados"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {/* Resumo de status */}
      <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex justify-between">
          <div className="text-center px-3">
            <div className="text-red-600 dark:text-red-400 font-medium text-lg">{stats.totalCritical}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Críticos</div>
          </div>
          
          <div className="text-center px-3 border-l border-r dark:border-gray-700">
            <div className="text-amber-600 dark:text-amber-400 font-medium text-lg">{stats.totalWarning}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Alerta</div>
          </div>
          
          <div className="text-center px-3">
            <div className="text-green-600 dark:text-green-400 font-medium text-lg">{stats.totalNormal}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Normais</div>
          </div>
        </div>
      </div>
      
      {/* Lista de recursos por departamento */}
      <div className="divide-y dark:divide-gray-700">
        {Object.entries(resourcesData).map(([department, resources]) => {
          const isExpanded = expandedDepartments.includes(department);
          const hasCritical = resources.some(r => r.status === 'critical');
          const hasWarning = resources.some(r => r.status === 'warning');
          
          return (
            <div key={department} className="overflow-hidden">
              {/* Cabeçalho do departamento */}
              <div 
                className={`
                  p-3 flex items-center justify-between cursor-pointer
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                  ${hasCritical ? 'bg-red-50 dark:bg-red-900/10' : hasWarning ? 'bg-amber-50 dark:bg-amber-900/10' : ''}
                `}
                onClick={() => toggleDepartment(department)}
              >
                <div className="flex items-center">
                  {hasCritical ? (
                    <AlertCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                  ) : hasWarning ? (
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Stethoscope className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  )}
                  
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {department}
                  </h4>
                  
                  {hasCritical && (
                    <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded">
                      Crítico
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <button
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartChat(department, department);
                    }}
                    title="Iniciar chat sobre este departamento"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </button>
                  
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Recursos do departamento (expandido) */}
              {isExpanded && (
                <div className="bg-gray-50 dark:bg-gray-800/50 pt-1 pb-2 px-3">
                  <div className="space-y-2">
                    {resources.map(resource => (
                      <div 
                        key={resource.id}
                        className={`
                          p-2 rounded-lg border 
                          ${resource.status === 'critical' 
                            ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                            : resource.status === 'warning'
                              ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`
                              w-7 h-7 rounded-full flex items-center justify-center mr-2
                              ${resource.status === 'critical' 
                                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' 
                                : resource.status === 'warning'
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }
                            `}>
                              {resource.icon}
                            </div>
                            
                            <div>
                              <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                {resource.name}
                              </div>
                              
                              <div className="flex items-center text-xs mt-0.5">
                                <span className={`
                                  ${resource.status === 'critical' 
                                    ? 'text-red-700 dark:text-red-300' 
                                    : resource.status === 'warning'
                                      ? 'text-amber-700 dark:text-amber-300'
                                      : 'text-green-700 dark:text-green-300'
                                  }
                                `}>
                                  {resource.current}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 mx-1">/</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {resource.total} {resource.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {/* Barra de progresso */}
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mr-2 overflow-hidden">
                              <div 
                                className={`
                                  h-full rounded-full
                                  ${resource.status === 'critical' 
                                    ? 'bg-red-500 dark:bg-red-600' 
                                    : resource.status === 'warning'
                                      ? 'bg-amber-500 dark:bg-amber-600'
                                      : 'bg-green-500 dark:bg-green-600'
                                  }
                                `}
                                style={{ width: `${(resource.current / resource.total) * 100}%` }}
                              ></div>
                            </div>
                            
                            <button
                              className="p-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                              onClick={() => handleStartChat(resource.name, department)}
                              title="Iniciar chat sobre este recurso"
                            >
                              <MessageSquare className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Rodapé */}
      <div className="p-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <div>
          {Object.values(resourcesData).flat().length} recursos monitorados
        </div>
        <div className="flex items-center">
          <RefreshCw className="h-3 w-3 mr-1" />
          <span>Atualizado: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};