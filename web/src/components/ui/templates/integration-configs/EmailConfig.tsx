/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info, Mail, Plus, Trash2 } from 'lucide-react';

// Interface para os dados de configuração do Email
export interface IEmailConfig {
  smtpServer: string;
  port: number;
  encryption: 'none' | 'tls' | 'ssl';
  senderEmail: string;
  senderName: string;
  requireAuth: boolean;
  username: string;
  password: string;
  defaultTemplate: string;
  emailFooter: string;
  includeLogo: boolean;
  notificationTypes: {
    appointments: boolean;
    examResults: boolean;
    prescriptions: boolean;
    system: boolean;
  };
  throttleLimit: number; // emails por minuto
  testRecipient: string;
  bccAddresses: string[];
  maxAttachmentSize: number; // em MB
}

interface IEmailConfigProps {
  config?: Partial<IEmailConfig>;
  onChange: (config: Partial<IEmailConfig>) => void;
}

export const EmailConfig: React.FC<IEmailConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<IEmailConfig>>({
    smtpServer: '',
    port: 587,
    encryption: 'tls',
    senderEmail: '',
    senderName: 'Hospital System',
    requireAuth: true,
    username: '',
    password: '',
    defaultTemplate: 'default',
    emailFooter: '',
    includeLogo: true,
    notificationTypes: {
      appointments: true,
      examResults: true,
      prescriptions: true,
      system: true
    },
    throttleLimit: 60,
    testRecipient: '',
    bccAddresses: [],
    maxAttachmentSize: 10,
    ...config
  });  

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<IEmailConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof IEmailConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

// Função para alternar tipos de notificação
const toggleNotificationType = (type: keyof IEmailConfig['notificationTypes']) => {
  // Certifique-se de que notificationTypes existe antes de tentar modificá-lo
  const currentTypes = settings.notificationTypes || {
    appointments: false,
    examResults: false,
    prescriptions: false,
    system: false
  };
  
  updateSettings({
    notificationTypes: {
      ...currentTypes,
      [type]: !currentTypes[type]
    }
  });
};

  // Novo endereço BCC para adicionar
  const [newBccAddress, setNewBccAddress] = useState('');

  // Adicionar novo endereço BCC
  const addBccAddress = () => {
    if (
      newBccAddress && 
      !settings.bccAddresses?.includes(newBccAddress) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBccAddress) // Validação básica de email
    ) {
      const updatedAddresses = [...(settings.bccAddresses || []), newBccAddress];
      updateSettings({ bccAddresses: updatedAddresses });
      setNewBccAddress('');
    }
  };

  // Remover endereço BCC
  const removeBccAddress = (email: string) => {
    const updatedAddresses = settings.bccAddresses?.filter(addr => addr !== email) || [];
    updateSettings({ bccAddresses: updatedAddresses });
  };

  // Template de exemplo para visualização
  const getEmailTemplatePreview = () => {
    const template = settings.defaultTemplate;
    
    switch (template) {
      case 'minimal':
        return (
          <div className="border border-gray-200 dark:border-gray-700 p-3 rounded">
            <div className="text-gray-900 dark:text-white font-medium mb-2">Consulta Agendada</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              Olá João,<br/><br/>
              Sua consulta foi agendada para 15 de abril às 14:30.<br/><br/>
              Atenciosamente,<br/>
              Equipe do Hospital
            </div>
          </div>
        );
      
      case 'detailed':
        return (
          <div className="border border-gray-200 dark:border-gray-700 p-3 rounded">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 mb-2 rounded-t">
              {settings.includeLogo && (
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 mb-2 rounded flex items-center justify-center text-blue-600 dark:text-blue-400">
                  H
                </div>
              )}
              <div className="text-blue-800 dark:text-blue-300 font-medium">Hospital System</div>
            </div>
            <div className="p-2">
              <div className="text-gray-900 dark:text-white font-medium mb-2">Confirmação de Consulta</div>
              <div className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                <p className="mb-2">Prezado(a) João,</p>
                <p className="mb-2">Confirmamos sua consulta com Dr. Carlos Silva para:</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded mb-2">
                  <p><strong>Data:</strong> 15/04/2023</p>
                  <p><strong>Hora:</strong> 14:30</p>
                  <p><strong>Local:</strong> Consultório 302</p>
                </div>
                <p className="mb-2">Lembre-se de trazer sua identificação e carteirinha do convênio.</p>
                <p>Atenciosamente,<br/>Equipe do Hospital</p>
              </div>
            </div>
            {settings.emailFooter && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400">
                {settings.emailFooter}
              </div>
            )}
          </div>
        );
        
      default: // template padrão
        return (
          <div className="border border-gray-200 dark:border-gray-700 p-3 rounded">
            <div className="text-gray-900 dark:text-white font-medium mb-2">Notificação do Sistema</div>
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              <p className="mb-2">Olá João,</p>
              <p className="mb-2">Este é um exemplo do template de email padrão do sistema.</p>
              <p>Atenciosamente,<br/>{settings.senderName}</p>
            </div>
            {settings.emailFooter && (
              <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-2 text-xs text-gray-500 dark:text-gray-400">
                {settings.emailFooter}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 lg:h-[500px] overflow-y-scroll">
      {/* Configurações do Servidor */}
      <div className='border-b border-gray-200 dark:border-gray-700 pb-12'>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações do Servidor</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="smtp-server" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Servidor SMTP
            </label>
            <div className="mt-1">
              <input
                id="smtp-server"
                type="text"
                value={settings.smtpServer}
                onChange={(e) => updateSettings({ smtpServer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="smtp.seudominio.com"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Porta
              </label>
              <div className="mt-1">
                <input
                  id="smtp-port"
                  type="number"
                  value={settings.port}
                  onChange={(e) => updateSettings({ port: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  placeholder="587"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label htmlFor="encryption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Criptografia
              </label>
              <div className="mt-1">
                <select
                  id="encryption"
                  value={settings.encryption}
                  onChange={(e) => updateSettings({ encryption: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">Nenhuma</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações do Remetente */}
      <div className='border-b border-gray-200 dark:border-gray-700 pb-12'>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Remetente</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sender-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email de Envio
              </label>
              <div className="mt-1">
                <input
                  id="sender-email"
                  type="email"
                  value={settings.senderEmail}
                  onChange={(e) => updateSettings({ senderEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  placeholder="notificacoes@hospital.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sender-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome de Exibição
              </label>
              <div className="mt-1">
                <input
                  id="sender-name"
                  type="text"
                  value={settings.senderName}
                  onChange={(e) => updateSettings({ senderName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  placeholder="Sistema Hospitalar"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="require-auth"
              type="checkbox"
              checked={settings.requireAuth}
              onChange={() => toggleSetting('requireAuth')}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="require-auth" className="text-sm text-gray-700 dark:text-gray-300">
              Requer autenticação
            </label>
          </div>

          {settings.requireAuth && (
            <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <div>
                <label htmlFor="auth-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuário
                </label>
                <div className="mt-1">
                  <input
                    id="auth-username"
                    type="text"
                    value={settings.username}
                    onChange={(e) => updateSettings({ username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    autoComplete="new-username" // Evitar autopreenchimento
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </label>
                <div className="mt-1">
                  <input
                    id="auth-password"
                    type="password"
                    value={settings.password}
                    onChange={(e) => updateSettings({ password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    autoComplete="new-password" // Evitar autopreenchimento
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configurações de Destino */}
      <div className='border-b border-gray-200 dark:border-gray-700 pb-12'>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Destino e Distribuição</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="bcc-addresses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cópias Ocultas (BCC)
            </label>
            <div className="flex space-x-2">
              <input
                id="bcc-addresses"
                type="email"
                value={newBccAddress}
                onChange={(e) => setNewBccAddress(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="email@exemplo.com"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={addBccAddress}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                disabled={!newBccAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBccAddress)}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            
            {settings.bccAddresses && settings.bccAddresses.length > 0 ? (
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {settings.bccAddresses.map(email => (
                  <div key={email} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                    <button
                      type="button"
                      onClick={() => removeBccAddress(email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                Nenhum endereço BCC configurado
              </p>
            )}
          </div>

          <div>
            <label htmlFor="test-recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email para Testes
            </label>
            <div className="mt-1">
              <input
                id="test-recipient"
                type="email"
                value={settings.testRecipient}
                onChange={(e) => updateSettings({ testRecipient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="teste@hospital.com"
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Endereço para enviar emails de teste e validar a configuração
            </p>
          </div>

          <div>
            <label htmlFor="throttle-limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Limite de Envios (por minuto)
            </label>
            <div className="mt-1">
              <input
                id="throttle-limit"
                type="number"
                min="1"
                max="1000"
                value={settings.throttleLimit}
                onChange={(e) => updateSettings({ throttleLimit: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Limite a quantidade de emails enviados por minuto para evitar bloqueios
            </p>
          </div>
        </div>
      </div>

      {/* Configurações de Conteúdo */}
      <div className='border-b border-gray-200 dark:border-gray-700 pb-12'>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações de Conteúdo</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="default-template" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Template Padrão
            </label>
            <div className="mt-1">
              <select
                id="default-template"
                value={settings.defaultTemplate}
                onChange={(e) => updateSettings({ defaultTemplate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              >
                <option value="default">Template Padrão</option>
                <option value="minimal">Template Minimalista</option>
                <option value="detailed">Template Detalhado</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="include-logo"
              type="checkbox"
              checked={settings.includeLogo}
              onChange={() => toggleSetting('includeLogo')}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="include-logo" className="text-sm text-gray-700 dark:text-gray-300">
              Incluir logo do hospital nos emails
            </label>
          </div>

          <div>
            <label htmlFor="email-footer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rodapé do Email
            </label>
            <div className="mt-1">
              <textarea
                id="email-footer"
                rows={3}
                value={settings.emailFooter}
                onChange={(e) => updateSettings({ emailFooter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="© 2023 Hospital System. Todos os direitos reservados."
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor="max-attachment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tamanho Máximo de Anexo (MB)
            </label>
            <div className="mt-1">
              <input
                id="max-attachment"
                type="number"
                min="1"
                max="50"
                value={settings.maxAttachmentSize}
                onChange={(e) => updateSettings({ maxAttachmentSize: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Notificações */}
      <div className='border-b border-gray-200 dark:border-gray-700 pb-12'>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tipos de Notificações</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              id="notify-appointments"
              type="checkbox"
              checked={settings.notificationTypes?.appointments}
              onChange={() => toggleNotificationType('appointments')}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="notify-appointments" className="text-sm text-gray-700 dark:text-gray-300">
              Agendamentos e Consultas
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="notify-exam-results"
              type="checkbox"
              checked={settings.notificationTypes?.examResults}
              onChange={() => toggleNotificationType('examResults')}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="notify-exam-results" className="text-sm text-gray-700 dark:text-gray-300">
              Resultados de Exames
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="notify-prescriptions"
              type="checkbox"
              checked={settings.notificationTypes?.prescriptions}
              onChange={() => toggleNotificationType('prescriptions')}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="notify-prescriptions" className="text-sm text-gray-700 dark:text-gray-300">
              Prescrições e Medicamentos
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="notify-system"
              type="checkbox"
              checked={settings.notificationTypes?.system}
              onChange={() => toggleNotificationType('system')}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="notify-system" className="text-sm text-gray-700 dark:text-gray-300">
              Alertas do Sistema
            </label>
          </div>
        </div>
      </div>

      {/* Preview do Email */}
      <div className='border-b border-gray-200 dark:border-gray-700 pb-12'>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview do Email</h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview do Template</span>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900">
            {getEmailTemplatePreview()}
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Observação</p>
          <p>
            Verifique as configurações do servidor SMTP e teste o envio antes de ativar esta integração para uso em produção.
            Certifique-se de que o servidor de email permite o envio automatizado de mensagens.
          </p>
        </div>
      </div>
    </div>
  );
};