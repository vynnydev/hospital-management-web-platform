/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Ambulance, 
  Bell, 
  Building2, 
  ChevronDown, 
  Send, 
  Users, 
  X
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Button } from '@/components/ui/organisms/button';
import type { IHospital } from '@/types/hospital-network-types';
import { useAlerts } from '../providers/alerts/AlertsProvider';
import { TAlertPriority, TAlertType } from '@/types/alert-types';

interface CreateAlertFormProps {
  selectedHospitals: IHospital[];
  hospitalId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateAlertForm: React.FC<CreateAlertFormProps> = ({
  selectedHospitals,
  hospitalId,
  onCancel,
  onSuccess
}) => {
  const { sendAlertToHospitals } = useAlerts();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState<TAlertType>('resource');
  const [priority, setPriority] = useState<TAlertPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Configurações para tipos de alerta
  const alertTypes: {
    id: TAlertType;
    name: string;
    icon: React.FC<any>;
    description: string;
    color: string;
  }[] = [
    {
      id: 'emergency',
      name: 'Emergência',
      icon: AlertTriangle,
      description: 'Situação que requer atenção imediata',
      color: 'text-red-500 dark:text-red-400'
    },
    {
      id: 'ambulance',
      name: 'Ambulância',
      icon: Ambulance,
      description: 'Notificação sobre ambulâncias',
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      id: 'patient-arrival',
      name: 'Chegada de Paciente',
      icon: Users,
      description: 'Paciente em rota para o hospital',
      color: 'text-green-500 dark:text-green-400'
    },
    {
      id: 'resource',
      name: 'Recurso',
      icon: Bell,
      description: 'Informação sobre recursos disponíveis',
      color: 'text-amber-500 dark:text-amber-400'
    }
  ];

  // Configurações para prioridades
  const priorityOptions: {
    id: TAlertPriority;
    name: string;
    description: string;
    color: string;
  }[] = [
    {
      id: 'high',
      name: 'Alta',
      description: 'Requer atenção imediata',
      color: 'text-red-500 dark:text-red-400'
    },
    {
      id: 'medium',
      name: 'Média',
      description: 'Atenção em até uma hora',
      color: 'text-amber-500 dark:text-amber-400'
    },
    {
      id: 'low',
      name: 'Baixa',
      description: 'Pode ser tratado durante o dia',
      color: 'text-blue-500 dark:text-blue-400'
    }
  ];

  // Modelos de mensagem baseados no tipo selecionado
  const messageTemplates: Record<TAlertType, string[]> = {
    'emergency': [
      'Situação de emergência: [descreva o problema]. Favor seguir o protocolo de emergência.',
      'Solicita-se apoio imediato para situação crítica em [local/departamento].',
      'Código [cor]: Emergência em andamento no [local]. Equipe de resposta necessária.'
    ],
    'ambulance': [
      'Ambulância a caminho com paciente em estado [estado]. ETA: [tempo] minutos.',
      'Prepare-se para receber transferência via ambulância. Paciente: [nome], condição: [condição].',
      'Ambulância solicitada para [local]. Motivo: [motivo]. Prioridade: [prioridade].'
    ],
    'patient-arrival': [
      'Paciente [nome] chegará em [tempo] minutos. Favor preparar [departamento/leito].',
      'Transferência de paciente confirmada. Chegada prevista: [horário].',
      'Preparem-se para receber novo paciente em [departamento]. Condição: [condição].'
    ],
    'resource': [
      'Atualização de recursos: [recurso] com disponibilidade limitada. Favor racionalizar uso.',
      'Solicitação de [recurso] para [departamento]. Necessidade: [quantidade/descrição].',
      'Notificação sobre manutenção de [equipamento] agendada para [data/horário].'
    ]
  };

  // Validação do formulário
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!title.trim()) {
      errors.title = 'O título do alerta é obrigatório';
    }
    
    if (!message.trim()) {
      errors.message = 'A mensagem do alerta é obrigatória';
    }
    
    if (selectedHospitals.length === 0) {
      errors.hospitals = 'Selecione pelo menos um hospital para enviar o alerta';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar o alerta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      sendAlertToHospitals(
            {
                title,
                message,
                type: alertType,
                priority,
                actionRequired: true,
                metadata: {},
                hospitalId
            },
            selectedHospitals.map(h => h.id)
        );
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'Erro ao enviar o alerta. Tente novamente.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Usar um modelo de mensagem
  const useTemplate = (template: string) => {
    setMessage(template);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Criar Novo Alerta</h3>
        <button 
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      {/* Form Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Hospitais selecionados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hospitais que receberão o alerta
            </label>
            
            {selectedHospitals.length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedHospitals.length} {selectedHospitals.length === 1 ? 'hospital selecionado' : 'hospitais selecionados'}
                  </span>
                </div>
                
                <ScrollArea className="max-h-28">
                  <div className="space-y-2">
                    {selectedHospitals.map(hospital => (
                      <div key={hospital.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm">{hospital.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {hospital.unit.city}, {hospital.unit.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Nenhum hospital selecionado. Selecione pelo menos um hospital.</span>
              </div>
            )}
            
            {formErrors.hospitals && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.hospitals}
              </p>
            )}
          </div>
          
          {/* Tipo de alerta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Alerta
            </label>
            <div className="grid grid-cols-2 gap-3">
              {alertTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAlertType(type.id)}
                  className={`p-3 rounded-lg border ${
                    alertType === type.id
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } flex flex-col items-start text-left`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      alertType === type.id ? type.color : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      <type.icon className="w-4 h-4" />
                    </div>
                    <span className={`font-medium ${alertType === type.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                      {type.name}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prioridade
            </label>
            <div className="flex gap-3">
              {priorityOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPriority(option.id)}
                  className={`flex-1 p-3 rounded-lg border ${
                    priority === option.id
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } flex flex-col items-center`}
                >
                  <span className={`font-medium ${
                    priority === option.id ? option.color : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option.name}
                  </span>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Título */}
          <div>
            <label htmlFor="alert-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Alerta
            </label>
            <input
              id="alert-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título claro e conciso"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.title}
              </p>
            )}
          </div>
          
          {/* Mensagem */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="alert-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mensagem do Alerta
              </label>
              <button
                type="button"
                className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ChevronDown className="w-3 h-3" />
                <span>Modelos</span>
              </button>
            </div>
            
            {/* Templates */}
            <div className="mb-2">
              <ScrollArea className="max-h-32">
                <div className="grid grid-cols-1 gap-2">
                  {messageTemplates[alertType].map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => useTemplate(template)}
                      className="text-left p-2 text-xs bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <textarea
              id="alert-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva o alerta em detalhes"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            />
            {formErrors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.message}
              </p>
            )}
          </div>
          
          {/* Submit Error */}
          {formErrors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
              {formErrors.submit}
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar Alerta
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};