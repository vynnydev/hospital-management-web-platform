/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  AlertTriangle, 
  Ambulance,
  Users, 
  Bell, 
  BedDouble, 
  UserCog, 
  Settings, 
  Stethoscope, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle, 
  FileText,
  Clock,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  User,
  Share2,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { IAlert, TAlertStatus, TAlertType } from '@/types/alert-types';

interface AlertDetailProps {
  alert: IAlert | null;
  onBack: () => void;
  onTakeAction?: (alert: IAlert, action: string) => void;
  onSelectHospital?: (hospitalId: string) => void;
  showHospitalInfo?: boolean;
}

export const AlertDetail: React.FC<AlertDetailProps> = ({
  alert,
  onBack,
  onTakeAction,
  onSelectHospital,
  showHospitalInfo = true
}) => {
  const { updateAlertStatus } = useAlertsProvider();
  const { networkData } = useNetworkData();

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <FileText className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Selecione um alerta
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          Escolha um alerta da lista para ver os detalhes e ações disponíveis
        </p>
      </div>
    );
  }

  // Encontrar o hospital relacionado ao alerta
  const hospital = networkData?.hospitals?.find(h => h.id === alert.hospitalId);

  // Configurar ícones e cores baseados no tipo e status do alerta
  const alertIconConfig: Record<TAlertType, {
    icon: React.FC<any>;
    bgColor: string;
    darkBgColor: string;
    textColor: string;
  }> = {
    'emergency': {
      icon: AlertTriangle,
      bgColor: 'bg-red-100',
      darkBgColor: 'dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400'
    },
    'ambulance': {
      icon: Ambulance,
      bgColor: 'bg-blue-100',
      darkBgColor: 'dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    'patient-arrival': {
      icon: Users,
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    'resource': {
      icon: Bell,
      bgColor: 'bg-amber-100',
      darkBgColor: 'dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    'occupancy': {
      icon: BedDouble,
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    'staff': {
      icon: UserCog,
      bgColor: 'bg-cyan-100',
      darkBgColor: 'dark:bg-cyan-900/30',
      textColor: 'text-cyan-600 dark:text-cyan-400'
    },
    'operational': {
      icon: Settings,
      bgColor: 'bg-slate-100',
      darkBgColor: 'dark:bg-slate-900/30',
      textColor: 'text-slate-600 dark:text-slate-400'
    },
    'equipment': {
      icon: Stethoscope,
      bgColor: 'bg-indigo-100',
      darkBgColor: 'dark:bg-indigo-900/30',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    'warning': {
      icon: AlertCircle,
      bgColor: 'bg-yellow-100',
      darkBgColor: 'dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    'info': {
      icon: Info,
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-950/30',
      textColor: 'text-blue-500 dark:text-blue-300'
    },
    'success': {
      icon: CheckCircle,
      bgColor: 'bg-emerald-100',
      darkBgColor: 'dark:bg-emerald-900/30',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    'error': {
      icon: XCircle,
      bgColor: 'bg-rose-100',
      darkBgColor: 'dark:bg-rose-900/30',
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    'system': {
      icon: Server,
      bgColor: '',
      darkBgColor: '',
      textColor: ''
    }
  };

  const statusConfig: Record<TAlertStatus, {
    label: string;
    icon: React.FC<any>;
    bgColor: string;
    textColor: string;
  }> = {
    'pending': {
      label: 'Pendente',
      icon: Clock,
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    'acknowledged': {
      label: 'Confirmado',
      icon: CheckCircle2,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    'resolved': {
      label: 'Resolvido',
      icon: CheckCircle2,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    'dismissed': {
      label: 'Descartado',
      icon: XCircle,
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      textColor: 'text-gray-500 dark:text-gray-400'
    }
  };

  const priorityLabels = {
    'high': 'Alta',
    'medium': 'Média',
    'low': 'Baixa',
    'critical': 'Critico'
  };

  const typeLabels = {
    'emergency': 'Emergência',
    'ambulance': 'Ambulância',
    'patient-arrival': 'Chegada de Paciente',
    'resource': 'Recurso',
    'occupancy': 'Ocupação',
    'staff': 'Colaborador',
    'operational': 'Operacional',
    'equipment': 'Equipamento',
    'warning': 'Atenção',
    'info': 'Informação',
    'success': 'Sucesso', 
    'error': 'Erro',
    'system': 'Sistema'
  };

  // Formatar a data completa do alerta
  const formatAlertDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(date);
  };

  // Determinar as ações baseadas no tipo de alerta
  const getActionButtons = () => {
    if (alert.status === 'resolved' || alert.status === 'dismissed') {
      return (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      );
    }

    switch (alert.type) {
      case 'emergency':
        return (
          <div className="space-y-3 mt-6">
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => {
                updateAlertStatus(alert.id, 'acknowledged');
                if (onTakeAction) onTakeAction(alert, 'iniciar-protocolo');
              }}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Iniciar Protocolo de Emergência
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  updateAlertStatus(alert.id, 'acknowledged');
                  if (onTakeAction) onTakeAction(alert, 'notificar-equipe');
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Notificar Equipe
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  updateAlertStatus(alert.id, 'resolved');
                  if (onTakeAction) onTakeAction(alert, 'marcar-resolvido');
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar como Resolvido
              </Button>
            </div>
          </div>
        );
      
      case 'ambulance':
        return (
          <div className="space-y-3 mt-6">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                updateAlertStatus(alert.id, 'acknowledged');
                if (onTakeAction) onTakeAction(alert, 'preparar-recepcao');
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Preparar Recepção do Paciente
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (onTakeAction) onTakeAction(alert, 'ver-localizacao');
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Ver Localização
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  updateAlertStatus(alert.id, 'resolved');
                  if (onTakeAction) onTakeAction(alert, 'confirmar-chegada');
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar Chegada
              </Button>
            </div>
          </div>
        );
      
      case 'resource':
        return (
          <div className="space-y-3 mt-6">
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                updateAlertStatus(alert.id, 'acknowledged');
                if (onTakeAction) onTakeAction(alert, 'solicitar-recurso');
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Solicitar Recurso
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (onTakeAction) onTakeAction(alert, 'verificar-disponibilidade');
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Verificar Disponibilidade
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  updateAlertStatus(alert.id, 'resolved');
                  if (onTakeAction) onTakeAction(alert, 'marcar-resolvido');
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar como Resolvido
              </Button>
            </div>
          </div>
        );
        
      case 'patient-arrival':
        return (
          <div className="space-y-3 mt-6">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                updateAlertStatus(alert.id, 'acknowledged');
                if (onTakeAction) onTakeAction(alert, 'preparar-recepcao');
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Preparar Recepção
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (onTakeAction) onTakeAction(alert, 'revisar-prontuario');
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Revisar Prontuário
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  updateAlertStatus(alert.id, 'resolved');
                  if (onTakeAction) onTakeAction(alert, 'confirmar-chegada');
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar Chegada
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                updateAlertStatus(alert.id, 'resolved');
                if (onTakeAction) onTakeAction(alert, 'marcar-resolvido');
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como Resolvido
            </Button>
          </div>
        );
    }
  };

  const IconComponent = alertIconConfig[alert.type].icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-medium">Detalhes do Alerta</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => updateAlertStatus(alert.id, 'dismissed')}
          >
            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* IAlert Content */}
      <div className="p-6">
        {/* IAlert Type Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full ${alertIconConfig[alert.type].bgColor} ${alertIconConfig[alert.type].darkBgColor} flex items-center justify-center ${alertIconConfig[alert.type].textColor}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {alert.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatAlertDate(alert.timestamp)}
              </span>
              
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                statusConfig[alert.status].bgColor
              } ${statusConfig[alert.status].textColor}`}>
                {statusConfig[alert.status].label}
              </span>
            </div>
          </div>
        </div>
        
        {/* IAlert Information */}
        <div className="space-y-6">
          {/* IAlert Message */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Descrição
            </h3>
            <p className="text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {alert.message}
            </p>
          </div>
          
          {/* IAlert Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Detalhes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tipo</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {typeLabels[alert.type]}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Prioridade</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {priorityLabels[alert.priority]}
                </p>
              </div>
              
              {alert.type === 'ambulance' && alert.metadata?.estimatedArrival && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hora estimada de chegada</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {new Date(alert.metadata.estimatedArrival).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
              
              {showHospitalInfo && hospital && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hospital</p>
                  <button 
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    onClick={() => {
                      if (onSelectHospital) onSelectHospital(alert.hospitalId ? alert.hospitalId : '');
                    }}
                  >
                    {hospital.name}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* IAlert Timeline */}
          {alert.status !== 'pending' && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Linha do Tempo
              </h3>
              <ol className="relative border-l border-gray-200 dark:border-gray-700 pl-6 py-2 ml-3 space-y-4">
                <li className="mb-6">
                  <div className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full border border-white dark:border-gray-800"></div>
                  <time className="mb-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                    {formatAlertDate(alert.timestamp)}
                  </time>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alerta criado</h3>
                </li>
                
                {(alert.status === 'acknowledged' || alert.status === 'resolved' || alert.status === 'dismissed') && (
                    <li className="mb-6">
                        <div className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded-full border border-white dark:border-gray-800"></div>
                        <time className="mb-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                        {formatAlertDate(new Date(alert.timestamp.getTime() + 5 * 60000))}
                        </time>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Alerta confirmado
                        </h3>
                    </li>
                )}
                
                {alert.status === 'resolved' && (
                  <li>
                    <div className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-green-200 dark:bg-green-800 rounded-full border border-white dark:border-gray-800"></div>
                    <time className="mb-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                      {formatAlertDate(new Date(alert.timestamp.getTime() + 20 * 60000))}
                    </time>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Alerta resolvido
                    </h3>
                  </li>
                )}
                
                {alert.status === 'dismissed' && (
                  <li>
                    <div className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-red-200 dark:bg-red-800 rounded-full border border-white dark:border-gray-800"></div>
                    <time className="mb-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                      {formatAlertDate(new Date(alert.timestamp.getTime() + 10 * 60000))}
                    </time>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Alerta descartado
                    </h3>
                  </li>
                )}
              </ol>
            </div>
          )}
          
          {/* Action Buttons */}
          {getActionButtons()}
        </div>
      </div>
    </div>
  );
};