/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { 
  IAlertTemplate, 
  TAlertType, 
  TAlertPriority, 
  TAlertCondition, 
  TAlertSeverity,
} from '@/types/alert-types';
import { TNotificationChannel } from '@/types/notification-settings-types';

interface AlertEditorProps {
  template?: IAlertTemplate | null;
  isCreating?: boolean;
  onTest?: () => void;
  onDisable?: () => void;
  onCancel?: () => void;
  onSave?: (alertData: any) => void;
}

export const AlertEditor: React.FC<AlertEditorProps> = ({
  template,
  isCreating = false,
  onTest,
  onDisable,
  onCancel,
  onSave
}) => {
  // Estados para os campos do formulário
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [alertType, setAlertType] = useState<TAlertType>('resource');
  const [priority, setPriority] = useState<TAlertPriority>('medium');
  const [conditionType, setConditionType] = useState<TAlertCondition>('greater');
  const [threshold, setThreshold] = useState<string>('85');
  const [thresholdSecondary, setThresholdSecondary] = useState<string>('90');
  const [persistence, setPersistence] = useState<string>('15');
  const [severity, setSeverity] = useState<TAlertSeverity>('warning');
  const [message, setMessage] = useState<string>('');
  const [channels, setChannels] = useState<TNotificationChannel[]>(['email', 'dashboard']);
  const [activeTab, setActiveTab] = useState<TAlertType>('resource');
  
  // Efeito para preencher o formulário quando um template é carregado
  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setAlertType(template.type);
      setPriority(template.priority);
      setConditionType(template.condition.type);
      setThreshold(template.condition.threshold.toString());
      if (template.condition.thresholdSecondary) {
        setThresholdSecondary(template.condition.thresholdSecondary.toString());
      }
      setPersistence(template.condition.persistence.toString());
      setSeverity(template.severity);
      setMessage(template.message);
      setChannels(template.channels);
      setActiveTab(template.type);
    } else if (isCreating) {
      // Valores padrão para criação
      setName('Novo Template');
      setDescription('Descrição do novo template');
      setAlertType('resource');
      setPriority('medium');
      setConditionType('greater');
      setThreshold('85');
      setThresholdSecondary('90');
      setPersistence('15');
      setSeverity('warning');
      setMessage('Alerta: A [métrica] atingiu [valor]%, acima do limite de [limite]%.');
      setChannels(['email', 'dashboard']);
      setActiveTab('resource');
    }
  }, [template, isCreating]);
  
  // Handler para alternar estado de um canal
  const toggleChannel = (channel: TNotificationChannel) => {
    setChannels(prev => {
      if (prev.includes(channel)) {
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };
  
  // Handler para salvar o alerta/template
  const handleSave = () => {
    if (onSave) {
      const alertData = {
        name,
        description,
        type: alertType,
        priority,
        condition: {
          type: conditionType,
          threshold: parseInt(threshold, 10),
          ...(conditionType === 'between' && { thresholdSecondary: parseInt(thresholdSecondary, 10) }),
          persistence: parseInt(persistence, 10)
        },
        message,
        severity,
        channels
      };
      
      onSave(alertData);
    }
  };
  
  // Traduzir tipos de alerta para português
  const getAlertTypeLabel = (type: TAlertType): string => {
    switch (type) {
      case 'resource':
        return 'Recursos';
      case 'patient-arrival':
        return 'Pacientes';
      case 'ambulance':
        return 'Ambulâncias';
      case 'emergency':
        return 'Emergências';
      case 'system':
        return 'Sistema';
      default:
        return 'Outro';
    }
  };
  
  // Função para obter rótulo para o limite com base no tipo
  const getThresholdLabel = (): string => {
    switch (activeTab) {
      case 'resource':
        return 'Valor de Limite (%)';
      case 'patient-arrival':
        return 'Tempo de Espera (min)';
      case 'ambulance':
        return 'Tempo de Resposta (min)';
      case 'emergency':
        return 'Limite Crítico';
      default:
        return 'Valor de Limite';
    }
  };
  
  // Placeholder para mensagem com base no tipo
  const getMessagePlaceholder = (): string => {
    switch (activeTab) {
      case 'resource':
        return 'A taxa de ocupação atingiu [valor]%, acima do limite de [limite]%.';
      case 'patient-arrival':
        return 'O tempo de espera atingiu [valor] minutos, acima do limite de [limite] minutos.';
      case 'ambulance':
        return 'A ambulância [id] está com tempo de resposta de [valor] minutos.';
      case 'emergency':
        return 'Situação de emergência detectada em [departamento]. Nível: [valor].';
      default:
        return 'Alerta: [descrição] atingiu [valor].';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          {isCreating ? 'Criar Novo Template de Alerta' : 
           template ? `Editar Template: ${template.name}` : 'Sistema de Notificações'}
        </CardTitle>
        <CardDescription>
          {isCreating ? 'Configure um novo template de alerta' : 
           template ? 'Edite as configurações do template de alerta' : 
           'Configure alertas e notificações para eventos críticos'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nome e descrição do template */}
        {(isCreating || template) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Template
              </label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alerta de Ocupação Crítica"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição Breve
              </label>
              <Input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Alerta quando a ocupação ultrapassa 90%"
              />
            </div>
          </div>
        )}
        
        {/* Tabs para diferentes tipos de alertas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2 overflow-x-auto">
            {(['resource', 'patient-arrival', 'ambulance', 'emergency', 'system'] as TAlertType[]).map((type) => (
              <button 
                key={type}
                className={`px-4 py-2 whitespace-nowrap ${
                  activeTab === type 
                    ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => {
                  setActiveTab(type);
                  setAlertType(type);
                }}
              >
                {getAlertTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Editor de configuração do alerta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condição
              </label>
              <Select 
                value={conditionType} 
                onValueChange={(value) => setConditionType(value as TAlertCondition)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Maior que</SelectItem>
                  <SelectItem value="less">Menor que</SelectItem>
                  <SelectItem value="equal">Igual a</SelectItem>
                  <SelectItem value="between">Entre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {getThresholdLabel()}
              </label>
              <Input 
                type="number" 
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
            </div>
            
            {conditionType === 'between' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Limite Superior (%)
                </label>
                <Input 
                  type="number" 
                  value={thresholdSecondary}
                  onChange={(e) => setThresholdSecondary(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Persistência (minutos)
              </label>
              <Input 
                type="number" 
                value={persistence}
                onChange={(e) => setPersistence(e.target.value)}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tempo que a condição deve persistir antes de disparar o alerta
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridade
              </label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TAlertPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severidade Visual
              </label>
              <Select 
                value={severity} 
                onValueChange={(value) => setSeverity(value as TAlertSeverity)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informativo</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="emergency">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canais de Notificação
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="email" 
                    className="mr-2" 
                    checked={channels.includes('email')}
                    onChange={() => toggleChannel('email')}
                  />
                  <label htmlFor="email" className="text-sm">Email</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="sms" 
                    className="mr-2" 
                    checked={channels.includes('sms')}
                    onChange={() => toggleChannel('sms')}
                  />
                  <label htmlFor="sms" className="text-sm">SMS</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="dashboard" 
                    className="mr-2" 
                    checked={channels.includes('dashboard')}
                    onChange={() => toggleChannel('dashboard')}
                  />
                  <label htmlFor="dashboard" className="text-sm">Dashboard</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="app" 
                    className="mr-2" 
                    checked={channels.includes('app')}
                    onChange={() => toggleChannel('app')}
                  />
                  <label htmlFor="app" className="text-sm">Aplicativo</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mensagem Personalizada
            </label>
            <Textarea 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={getMessagePlaceholder()}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use [valor] para incluir o valor detectado, [limite] para o limite configurado
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onTest}>
              Testar Notificação
            </Button>
            {template && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={onDisable}
              >
                Desativar
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              size="sm" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSave}
            >
              {isCreating ? 'Criar Template' : template ? 'Atualizar Template' : 'Salvar Alerta'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};