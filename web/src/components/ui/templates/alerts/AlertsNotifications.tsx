/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAlerts } from '../providers/alerts/AlertsProvider';
import { 
  AlertTriangle, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  Clock, 
  AlertCircle,
  ThumbsUp,
  User,
  Bed,
  Heart,
  MessageCircle,
  Ambulance,
  RefreshCw,
  Building2,
  FileText
} from 'lucide-react';
import { IAlert, TAlertPriority, TAlertType, TAlertStatus } from '@/types/alert-types';

interface AlertsNotificationsProps {
  hospitalId: string;
}

export const AlertsNotifications: React.FC<AlertsNotificationsProps> = ({ hospitalId }) => {
  const { alerts, markAsRead, updateAlertStatus, dismissAlert, getFilteredAlerts } = useAlerts();
  const { networkData } = useNetworkData();
  
  const [filterType, setFilterType] = useState<TAlertType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TAlertPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TAlertStatus | 'all'>('pending');
  const [sortBy, setSortBy] = useState<'newest' | 'priority'>('priority');
  const [isLoading, setIsLoading] = useState(false);
  
  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
  
  // Criar alguns alertas simulados se não houver alertas reais
  const getAlerts = () => {
    let filteredAlerts = alerts.filter(a => a.hospitalId === hospitalId || !a.hospitalId);
    
    // Se não houver alertas, criar alguns de exemplo
    if (filteredAlerts.length === 0) {
      filteredAlerts = [
        {
          id: 'alert-1',
          title: 'Ocupação de UTI crítica',
          message: 'A taxa de ocupação da UTI atingiu 95%, acima do limite seguro de 90%.',
          type: 'resource',
          priority: 'high',
          timestamp: new Date(Date.now() - 30 * 60000), // 30 minutos atrás
          read: false,
          status: 'pending',
          actionRequired: true,
          hospitalId: hospitalId,
          metadata: {
            departmentId: 'UTI',
            currentValue: 95,
            threshold: 90
          }
        },
        {
          id: 'alert-2',
          title: 'Escassez de equipe de enfermagem',
          message: 'A razão enfermeiro/paciente está abaixo do recomendado no turno noturno.',
          type: 'resource',
          priority: 'medium',
          timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 horas atrás
          read: true,
          status: 'acknowledged',
          actionRequired: true,
          hospitalId: hospitalId,
          metadata: {
            departmentId: 'Enfermaria',
            shift: 'Noite',
            currentRatio: 1.15,
            recommendedRatio: 1.5
          }
        },
        {
          id: 'alert-3',
          title: 'Ambulância com manutenção atrasada',
          message: 'A ambulância AMB-1234 está com a manutenção preventiva atrasada em 7 dias.',
          type: 'ambulance',
          priority: 'medium',
          timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 horas atrás
          read: false,
          status: 'pending',
          actionRequired: true,
          hospitalId: hospitalId,
          metadata: {
            ambulanceId: 'AMB-1234',
            daysOverdue: 7,
            lastMaintenance: '2025-01-15'
          }
        },
        {
          id: 'alert-4',
          title: 'Paciente com sinais vitais alterados',
          message: 'O paciente João Silva no leito UTI-101 apresenta alterações nos sinais vitais.',
          type: 'patient-arrival',
          priority: 'high',
          timestamp: new Date(Date.now() - 15 * 60000), // 15 minutos atrás
          read: false,
          status: 'pending',
          actionRequired: true,
          hospitalId: hospitalId,
          metadata: {
            patientId: 'P001',
            bedId: 'UTI-101',
            vitalSigns: {
              bloodPressure: '150/90',
              heartRate: 110,
              temperature: 38.2
            }
          }
        },
        {
          id: 'alert-5',
          title: 'Nova mensagem de médico',
          message: 'Dr. Carlos Silveira enviou uma mensagem sobre o paciente Maria Santos.',
          type: 'emergency',
          priority: 'low',
          timestamp: new Date(Date.now() - 45 * 60000), // 45 minutos atrás
          read: true,
          status: 'acknowledged',
          actionRequired: false,
          hospitalId: hospitalId,
          metadata: {
            staffId: 'D002',
            patientId: 'P002',
            subject: 'Revisão de medicação'
          }
        }
      ];
    }
    
    // Aplicar filtros de tipo
    if (filterType !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filterType);
    }
    
    // Aplicar filtros de prioridade
    if (filterPriority !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.priority === filterPriority);
    }
    
    // Aplicar filtros de status
    if (filterStatus !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === filterStatus);
    }
    
    // Aplicar ordenação
    if (sortBy === 'newest') {
      filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === 'priority') {
      // Ordenar por prioridade (high > medium > low)
      const priorityOrder: Record<TAlertPriority, number> = { high: 0, medium: 1, low: 2 };
      filteredAlerts.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        // Se a prioridade for igual, ordenar por data (mais recente primeiro)
        if (priorityDiff === 0) {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        
        return priorityDiff;
      });
    }
    
    return filteredAlerts;
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) {
      return 'agora';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m atrás`;
    } else if (diffMinutes < 24 * 60) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffMinutes / (24 * 60));
      return `${days}d atrás`;
    }
  };
  
  // Obter ícone baseado no tipo de alerta
  const getAlertIcon = (type: TAlertType) => {
    switch (type) {
      case 'resource':
        return <FileText className="h-5 w-5" />;
      case 'patient-arrival':
        return <User className="h-5 w-5" />;
      case 'ambulance':
        return <Ambulance className="h-5 w-5" />;
      case 'emergency':
        return <Heart className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  // Obter cor baseada na prioridade
  const getPriorityColor = (priority: TAlertPriority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      case 'low':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };
  
  // Obter cor baseada no tipo
  const getTypeColor = (type: TAlertType) => {
    switch (type) {
      case 'resource':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'patient-arrival':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200';
      case 'ambulance':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200';
      case 'emergency':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };
  
  // Obter texto traduzido do tipo de alerta
  const getTypeText = (type: TAlertType): string => {
    switch (type) {
      case 'resource':
        return 'Recursos';
      case 'patient-arrival':
        return 'Paciente';
      case 'ambulance':
        return 'Ambulância';
      case 'emergency':
        return 'Emergência';
      default:
        return 'Sistema';
    }
  };
  
  // Obter texto traduzido da prioridade
  const getPriorityText = (priority: TAlertPriority): string => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
    }
  };
  
  // Obter texto traduzido do status
  const getStatusText = (status: TAlertStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'acknowledged':
        return 'Reconhecido';
      case 'resolved':
        return 'Resolvido';
      case 'dismissed':
        return 'Descartado';
    }
  };
  
  // Lidar com mudança de status
  const handleStatusChange = (alert: IAlert, status: TAlertStatus) => {
    updateAlertStatus(alert.id, status);
  };
  
  const filteredAlerts = getAlerts();
  
  // Se estiver carregando, mostre um indicador
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Carregando alertas...
          </p>
        </div>
      </div>
    );
  }
  
  // Se não houver hospital selecionado
  if (!hospital) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-red-200 dark:text-red-900 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Alertas e Notificações</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Selecione um hospital para visualizar seus alertas e notificações.
        </p>
        <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg">
          <Building2 className="h-5 w-5 mr-2" />
          <span>Use o seletor acima para escolher um hospital</span>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
          Alertas e Notificações
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TAlertType | 'all')}
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm pl-8 pr-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 appearance-none"
            >
              <option value="all">Todos os tipos</option>
              <option value="resource">Recursos</option>
              <option value="patient-arrival">Pacientes</option>
              <option value="ambulance">Ambulâncias</option>
              <option value="emergency">Emergências</option>
            </select>
            <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TAlertPriority | 'all')}
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm pl-8 pr-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 appearance-none"
            >
              <option value="all">Todas prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
            <AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TAlertStatus | 'all')}
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm pl-8 pr-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 appearance-none"
            >
              <option value="all">Todos estados</option>
              <option value="pending">Pendentes</option>
              <option value="acknowledged">Reconhecidos</option>
              <option value="resolved">Resolvidos</option>
              <option value="dismissed">Descartados</option>
            </select>
            <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>
      
      {filteredAlerts.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
          <Bell className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Nenhum alerta encontrado
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Não há alertas correspondentes aos filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border
                ${!alert.read ? 'border-l-4 border-l-blue-600 dark:border-l-blue-500' : 'border-gray-200 dark:border-gray-600'}
              `}
              onClick={() => !alert.read && markAsRead(alert.id)}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {alert.title}
                        {!alert.read && (
                          <span className="ml-2 bg-blue-600 dark:bg-blue-500 rounded-full w-2 h-2"></span>
                        )}
                      </h4>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center mt-2 space-x-3">
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        alert.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
                          : alert.priority === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      }`}>
                        Prioridade {getPriorityText(alert.priority)}
                      </span>
                      
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${getTypeColor(alert.type)}`}>
                        {getTypeText(alert.type)}
                      </span>
                      
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        alert.status === 'pending' 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                          : alert.status === 'acknowledged'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                            : alert.status === 'resolved'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {getStatusText(alert.status)}
                      </span>
                    </div>
                    
                    {/* Detalhes específicos baseados no tipo de alerta */}
                    {alert.type === 'patient-arrival' && alert.metadata?.vitalSigns && (
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Sinais Vitais
                        </h5>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Pressão:</span>{' '}
                            <span className="text-gray-900 dark:text-gray-100">{alert.metadata.vitalSigns.bloodPressure}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">FC:</span>{' '}
                            <span className="text-gray-900 dark:text-gray-100">{alert.metadata.vitalSigns.heartRate} bpm</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Temp:</span>{' '}
                            <span className="text-gray-900 dark:text-gray-100">{alert.metadata.vitalSigns.temperature}°C</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {alert.status === 'pending' && (
                      <div className="flex mt-3 space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(alert, 'acknowledged');
                          }}
                          className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Reconhecer
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(alert, 'resolved');
                          }}
                          className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Resolver
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.id);
                          }}
                          className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Descartar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};