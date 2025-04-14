/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info, MessageCircle, AlertTriangle, Hash } from 'lucide-react';

// Interface para os dados de configuração do Slack
export interface SlackConfig {
  webhookUrl: string;
  defaultChannel: string;
  botName: string;
  botIcon: string;
  notifyEmergencies: boolean;
  notifyAppointments: boolean;
  notifyExamResults: boolean;
  notifySystemAlerts: boolean;
  emergencyMentions: string[];
  useThreads: boolean;
  notificationSchedule: {
    workingHoursOnly: boolean;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
  customMessageTemplate: string;
  silentMode: boolean;
}

interface SlackConfigProps {
  config?: Partial<SlackConfig>;
  onChange: (config: Partial<SlackConfig>) => void;
}

export const SlackConfig: React.FC<SlackConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<SlackConfig>>({
    webhookUrl: '',
    defaultChannel: 'geral',
    botName: 'Hospital Bot',
    botIcon: ':hospital:',
    notifyEmergencies: true,
    notifyAppointments: true,
    notifyExamResults: false,
    notifySystemAlerts: true,
    emergencyMentions: [],
    useThreads: true,
    notificationSchedule: {
      workingHoursOnly: true,
      startTime: '08:00',
      endTime: '18:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Segunda a sexta
    },
    customMessageTemplate: '',
    silentMode: false,
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<SlackConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof SlackConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  // Função para atualizar configurações do schedule
  const updateSchedule = (
    updates: Partial<SlackConfig['notificationSchedule']>
  ) => {
    updateSettings({
      notificationSchedule: {
        ...settings.notificationSchedule,
        ...updates
      } as SlackConfig['notificationSchedule']
    });
  };

  // Alternar dia da semana no schedule
  const toggleDayOfWeek = (day: number) => {
    const daysOfWeek = settings.notificationSchedule?.daysOfWeek || [];
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day];
    
    updateSchedule({ daysOfWeek: newDays });
  };

  // Novo @ para adicionar à lista de menções de emergência
  const [newMention, setNewMention] = useState('');

  // Adicionar nova menção
  const addMention = () => {
    if (newMention && !settings.emergencyMentions?.includes(newMention)) {
      const updatedMentions = [...(settings.emergencyMentions || []), newMention];
      updateSettings({ emergencyMentions: updatedMentions });
      setNewMention('');
    }
  };

  // Remover menção
  const removeMention = (mention: string) => {
    const updatedMentions = settings.emergencyMentions?.filter(m => m !== mention) || [];
    updateSettings({ emergencyMentions: updatedMentions });
  };

  // Dias da semana para exibição
  const weekdays = [
    { day: 0, label: 'D' },
    { day: 1, label: 'S' },
    { day: 2, label: 'T' },
    { day: 3, label: 'Q' },
    { day: 4, label: 'Q' },
    { day: 5, label: 'S' },
    { day: 6, label: 'S' },
  ];

  return (
    <div className="space-y-6 lg:h-[500px] overflow-y-scroll">
      {/* Configurações básicas */}
      <div className="space-y-4">
        <div>
          <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL do Webhook do Slack
          </label>
          <div className="mt-1">
            <input
              id="webhook-url"
              type="text"
              value={settings.webhookUrl}
              onChange={(e) => updateSettings({ webhookUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            URL do webhook do Slack para enviar mensagens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="default-channel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Canal Padrão
            </label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                <Hash className="h-4 w-4" />
              </span>
              <input
                id="default-channel"
                type="text"
                value={settings.defaultChannel}
                onChange={(e) => updateSettings({ defaultChannel: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="geral"
                autoComplete="off"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Canal onde as mensagens serão enviadas por padrão
            </p>
          </div>

          <div>
            <label htmlFor="bot-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Bot
            </label>
            <div className="mt-1">
              <input
                id="bot-name"
                type="text"
                value={settings.botName}
                onChange={(e) => updateSettings({ botName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="Hospital Bot"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bot-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ícone do Bot
            </label>
            <div className="mt-1">
              <input
                id="bot-icon"
                type="text"
                value={settings.botIcon}
                onChange={(e) => updateSettings({ botIcon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder=":hospital:"
                autoComplete="off"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Emoji ou URL da imagem para o ícone do bot
            </p>
          </div>

          <div>
            <label htmlFor="use-threads" className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>Usar Threads</span>
              <button
                type="button"
                onClick={() => toggleSetting('useThreads')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.useThreads ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.useThreads ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Organiza as mensagens relacionadas em threads
            </p>
          </div>
        </div>
      </div>

      {/* Tipos de notificações */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tipos de Notificações</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notify-emergencies"
              checked={settings.notifyEmergencies}
              onChange={() => toggleSetting('notifyEmergencies')}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
            />
            <label htmlFor="notify-emergencies" className="flex-1 flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Alertas de Emergência</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notify-appointments"
              checked={settings.notifyAppointments}
              onChange={() => toggleSetting('notifyAppointments')}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
            />
            <label htmlFor="notify-appointments" className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">Novos Agendamentos</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notify-results"
              checked={settings.notifyExamResults}
              onChange={() => toggleSetting('notifyExamResults')}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
            />
            <label htmlFor="notify-results" className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">Resultados de Exames</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notify-system"
              checked={settings.notifySystemAlerts}
              onChange={() => toggleSetting('notifySystemAlerts')}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
            />
            <label htmlFor="notify-system" className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">Alertas do Sistema</span>
            </label>
          </div>
        </div>

        {/* Menções em casos de emergência */}
        {settings.notifyEmergencies && (
          <div className="mt-4 pl-5 border-l-2 border-red-200 dark:border-red-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mencionar em Emergências
            </label>
            
            <div className="flex space-x-2 mb-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                  @
                </span>
                <input
                  type="text"
                  value={newMention}
                  onChange={(e) => setNewMention(e.target.value.replace('@', ''))}
                  placeholder="usuário ou canal"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                onClick={addMention}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newMention}
              >
                Adicionar
              </button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {settings.emergencyMentions?.map((mention) => (
                <div key={mention} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <span className="text-sm text-red-700 dark:text-red-300">@{mention}</span>
                  <button
                    type="button"
                    onClick={() => removeMention(mention)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remover"
                  >
                    &times;
                  </button>
                </div>
              ))}
              
              {(!settings.emergencyMentions || settings.emergencyMentions.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Nenhuma menção configurada
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Programação de notificações */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Programação de Notificações</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Apenas em Horário Comercial</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enviar notificações somente durante o horário definido
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateSchedule({ workingHoursOnly: !settings.notificationSchedule?.workingHoursOnly })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.notificationSchedule?.workingHoursOnly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notificationSchedule?.workingHoursOnly ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.notificationSchedule?.workingHoursOnly && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora de Início
                  </label>
                  <input
                    type="time"
                    value={settings.notificationSchedule?.startTime}
                    onChange={(e) => updateSchedule({ startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora de Término
                  </label>
                  <input
                    type="time"
                    value={settings.notificationSchedule?.endTime}
                    onChange={(e) => updateSchedule({ endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dias da Semana
                </label>
                <div className="flex space-x-2">
                  {weekdays.map(({ day, label }) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDayOfWeek(day)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${settings.notificationSchedule?.daysOfWeek?.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Modo Silencioso</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Não emitir sons nas notificações do Slack
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('silentMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.silentMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.silentMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Modelo de mensagem personalizado */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Modelo de Mensagem</h3>
        
        <div>
          <label htmlFor="message-template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Template Personalizado
          </label>
          <textarea
            id="message-template"
            value={settings.customMessageTemplate}
            onChange={(e) => updateSettings({ customMessageTemplate: e.target.value })}
            placeholder="Olá! Uma nova {type} está disponível: {message}"
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use {"{type}"}, {"{message}"}, {"{date}"}, {"{time}"}, {"{user}"} como variáveis
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="pt-4">
        <div className="flex items-start">
          <MessageCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-1" />
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Visualização da Mensagem
            </div>
            <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  H
                </div>
                <div className="ml-2">
                  <div className="flex items-center">
                    <span className="font-bold text-blue-700 dark:text-blue-300">{settings.botName}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">14:30</span>
                  </div>
                  <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    {settings.customMessageTemplate || "Alerta: Nova consulta agendada para o Dr. Silva às 15:00 com o paciente João Pereira."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aviso Legal */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start mt-6">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Observação</p>
          <p>
            Para utilizar esta integração, você precisa criar um App no Slack e configurar um webhook para seu workspace.
            Certifique-se de que o bot tenha as permissões necessárias para postar mensagens nos canais desejados.
          </p>
        </div>
      </div>
    </div>
  );
};