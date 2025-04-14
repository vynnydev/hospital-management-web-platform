/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { MessageTemplatesPanel } from './whatsapp/MessageTemplatesPanel';
import { ContactGroupsPanel } from './whatsapp/ContactGroupsPanel';
import { AutomationRulesPanel } from './whatsapp/AutomationRulesPanel';
import { SecuritySettingsPanel } from './whatsapp/SecuritySettingsPanel';
import { IAutomationRule, IContactGroup, IMessageTemplate, IWhatsAppConfig } from '@/types/integrations-configs/whatsapp-types';

interface WhatsAppConfigProps {
    config?: Partial<IWhatsAppConfig>;
    onChange: (config: Partial<IWhatsAppConfig>) => void;
  }
  
  export const WhatsAppConfig: React.FC<WhatsAppConfigProps> = ({
    config = {},
    onChange
  }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'templates' | 'groups' | 'automation' | 'security'>('general');
    
    // Estado local para gerenciar as configurações
    const [settings, setSettings] = useState<Partial<IWhatsAppConfig>>({
      apiKey: '',
      phoneNumberId: '',
      businessAccountId: '',
      verificationToken: '',
      webhookUrl: '',
      messageTemplates: [],
      contactGroups: [],
      automationRules: [],
      securitySettings: {
        endToEndEncryption: true,
        twoFactorAuth: true,
        ipWhitelist: [],
        messageRetentionDays: 30,
      },
      notificationSettings: {
        notifyNewMessages: true,
        notifyDeliveryStatus: true,
        notifyReadStatus: false,
        notifyErrors: true,
      },
      activeHours: {
        enabled: false,
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'America/Sao_Paulo',
        workingDays: [1, 2, 3, 4, 5], // Segunda a sexta
        autoReplyOutsideHours: true,
        outsideHoursMessage: 'Obrigado pelo contato. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Retornaremos o seu contato no próximo dia útil.',
      },
      ...config
    });
  
    // Função para atualizar as configurações
    const updateSettings = (updates: Partial<IWhatsAppConfig>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      onChange(newSettings);
    };
  
    // Função para alternar configurações booleanas
    const toggleSetting = (path: string) => {
      // Função que lida com caminhos aninhados como "notificationSettings.notifyNewMessages"
      const parts = path.split('.');
      const lastPart = parts.pop()!;
      const current = { ...settings };
      let parent = current;
  
      for (const part of parts) {
        if (!(parent as Record<string, any>)[part]) {
          (parent as Record<string, any>)[part] = {};
        }
        parent = (parent as Record<string, any>)[part];
      }
  
      (parent as Record<string, any>)[lastPart] = !(parent as Record<string, any>)[lastPart];
      updateSettings(current);
    };
  
    // Funções para atualizar arrays nos subcomponentes
    const updateMessageTemplates = (templates: IMessageTemplate[]) => {
      updateSettings({ messageTemplates: templates });
    };
  
    const updateContactGroups = (groups: IContactGroup[]) => {
      updateSettings({ contactGroups: groups });
    };
  
    const updateAutomationRules = (rules: IAutomationRule[]) => {
      updateSettings({ automationRules: rules });
    };
  
    const updateSecuritySettings = (securitySettings: IWhatsAppConfig['securitySettings']) => {
      updateSettings({ securitySettings });
    };
  
    return (
      <div className="space-y-6 lg:h-[500px] overflow-y-scroll">
        {/* Navegação por abas */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Grupos
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'automation'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Automação
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Segurança
            </button>
          </nav>
        </div>
  
        {/* Conteúdo da aba selecionada */}
        <div className="mt-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Configurações gerais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configurações Gerais</h3>
                
                <div>
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chave da API do WhatsApp Business
                  </label>
                  <div className="mt-1">
                    <input
                      id="api-key"
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => updateSettings({ apiKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      placeholder="Insira sua chave de API"
                      autoComplete="new-password"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Encontre sua chave de API no painel do WhatsApp Business
                  </p>
                </div>
  
                <div>
                  <label htmlFor="phone-number-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID do Número de Telefone
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone-number-id"
                      type="text"
                      value={settings.phoneNumberId}
                      onChange={(e) => updateSettings({ phoneNumberId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      placeholder="123456789012345"
                      autoComplete="off"
                    />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="business-account-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID da Conta Business
                  </label>
                  <div className="mt-1">
                    <input
                      id="business-account-id"
                      type="text"
                      value={settings.businessAccountId}
                      onChange={(e) => updateSettings({ businessAccountId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      placeholder="123456789012345"
                      autoComplete="off"
                    />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="verification-token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Token de Verificação
                  </label>
                  <div className="mt-1">
                    <input
                      id="verification-token"
                      type="text"
                      value={settings.verificationToken}
                      onChange={(e) => updateSettings({ verificationToken: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      placeholder="seu-token-de-verificacao"
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Usado para verificar o webhook com o WhatsApp
                  </p>
                </div>
  
                <div>
                  <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL do Webhook
                  </label>
                  <div className="mt-1">
                    <input
                      id="webhook-url"
                      type="text"
                      value={settings.webhookUrl}
                      onChange={(e) => updateSettings({ webhookUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      placeholder="https://seu-dominio.com/webhook/whatsapp"
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Endpoint que receberá as notificações do WhatsApp
                  </p>
                </div>
              </div>
  
              {/* Configurações de Notificações */}
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notificações</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Novas Mensagens</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receber alertas quando novas mensagens chegarem
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting('notificationSettings.notifyNewMessages')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.notificationSettings?.notifyNewMessages ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.notificationSettings?.notifyNewMessages ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Status de Entrega</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receber alertas quando mensagens forem entregues
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting('notificationSettings.notifyDeliveryStatus')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.notificationSettings?.notifyDeliveryStatus ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.notificationSettings?.notifyDeliveryStatus ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Status de Leitura</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receber alertas quando mensagens forem lidas
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting('notificationSettings.notifyReadStatus')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.notificationSettings?.notifyReadStatus ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.notificationSettings?.notifyReadStatus ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Erros e Falhas</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receber alertas sobre erros no envio de mensagens
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSetting('notificationSettings.notifyErrors')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.notificationSettings?.notifyErrors ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.notificationSettings?.notifyErrors ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
  
              {/* Horários de Atendimento */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Horários de Atendimento</h3>
                  <button
                    type="button"
                    onClick={() => toggleSetting('activeHours.enabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.activeHours?.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.activeHours?.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {settings.activeHours?.enabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Horário de Início
                        </label>
                        <input
                          id="start-time"
                          type="time"
                          value={settings.activeHours?.startTime}
                          onChange={(e) => updateSettings({ 
                            activeHours: { ...settings.activeHours!, startTime: e.target.value } 
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Horário de Término
                        </label>
                        <input
                          id="end-time"
                          type="time"
                          value={settings.activeHours?.endTime}
                          onChange={(e) => updateSettings({ 
                            activeHours: { ...settings.activeHours!, endTime: e.target.value } 
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        />
                      </div>
                    </div>
  
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fuso Horário
                      </label>
                      <select
                        id="timezone"
                        value={settings.activeHours?.timezone}
                        onChange={(e) => updateSettings({ 
                          activeHours: { ...settings.activeHours!, timezone: e.target.value } 
                        })}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      >
                        <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                        <option value="Europe/London">Europe/London (GMT+0)</option>
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      </select>
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dias de Funcionamento
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { day: 0, label: 'Dom' },
                          { day: 1, label: 'Seg' },
                          { day: 2, label: 'Ter' },
                          { day: 3, label: 'Qua' },
                          { day: 4, label: 'Qui' },
                          { day: 5, label: 'Sex' },
                          { day: 6, label: 'Sáb' },
                        ].map(({ day, label }) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const workingDays = settings.activeHours?.workingDays || [];
                              const newWorkingDays = workingDays.includes(day)
                                ? workingDays.filter(d => d !== day)
                                : [...workingDays, day];
                              
                              updateSettings({
                                activeHours: { ...settings.activeHours!, workingDays: newWorkingDays }
                              });
                            }}
                            className={`flex items-center justify-center w-10 h-10 rounded-full 
                              ${settings.activeHours?.workingDays?.includes(day)
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'}
                            `}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Resposta Automática Fora do Horário</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Responder automaticamente mensagens recebidas fora do horário
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSetting('activeHours.autoReplyOutsideHours')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.activeHours?.autoReplyOutsideHours ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.activeHours?.autoReplyOutsideHours ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
  
                    {settings.activeHours?.autoReplyOutsideHours && (
                      <div>
                        <label htmlFor="outside-hours-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Mensagem Fora do Horário
                        </label>
                        <textarea
                          id="outside-hours-message"
                          value={settings.activeHours?.outsideHoursMessage}
                          onChange={(e) => updateSettings({ 
                            activeHours: { ...settings.activeHours!, outsideHoursMessage: e.target.value } 
                          })}
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md resize-none"
                          placeholder="Mensagem automática enviada fora do horário de funcionamento"
                        ></textarea>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
  
          {activeTab === 'templates' && (
            <MessageTemplatesPanel 
              templates={settings.messageTemplates || []} 
              onChange={updateMessageTemplates}
            />
          )}
  
          {activeTab === 'groups' && (
            <ContactGroupsPanel 
              groups={settings.contactGroups || []} 
              onChange={updateContactGroups}
            />
          )}
  
          {activeTab === 'automation' && (
            <AutomationRulesPanel 
              rules={settings.automationRules || []} 
              templates={settings.messageTemplates || []}
              onChange={updateAutomationRules}
            />
          )}
  
          {activeTab === 'security' && (
            <SecuritySettingsPanel 
              securitySettings={settings.securitySettings!} 
              onChange={updateSecuritySettings}
            />
          )}
        </div>
  
        {/* Observação/Aviso */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start mt-6">
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Observação sobre a API do WhatsApp</p>
            <p>
              Para utilizar esta integração, você precisa ter uma conta WhatsApp Business API. 
              As mensagens enviadas estão sujeitas às políticas do WhatsApp e devem seguir os 
              templates aprovados para mensagens iniciais ou respostas a contatos existentes.
            </p>
          </div>
        </div>
      </div>
    );
};