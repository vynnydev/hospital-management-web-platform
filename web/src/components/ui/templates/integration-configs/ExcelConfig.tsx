/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info, FileSpreadsheet } from 'lucide-react';

// Interface para os dados de configuração do Excel/Sheets
export interface ExcelConfig {
  exportPath: string;
  defaultFormat: 'xlsx' | 'csv' | 'ods';
  autoExport: boolean;
  includeCharts: boolean;
  exportSchedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  exportTime: string;
  exportDayOfWeek?: number;
  exportDayOfMonth?: number;
  notifyOnExport: boolean;
  recipients: string[];
  templateId: string;
  customHeaders: boolean;
  password: string;
  protectSheets: boolean;
}

interface ExcelConfigProps {
  config?: Partial<ExcelConfig>;
  onChange: (config: Partial<ExcelConfig>) => void;
}

export const ExcelConfig: React.FC<ExcelConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<ExcelConfig>>({
    exportPath: '/exports',
    defaultFormat: 'xlsx',
    autoExport: true,
    includeCharts: true,
    exportSchedule: 'daily',
    exportTime: '23:00',
    notifyOnExport: true,
    recipients: [],
    templateId: '',
    customHeaders: false,
    password: '',
    protectSheets: false,
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<ExcelConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof ExcelConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  // Novo email para adicionar à lista de destinatários
  const [newRecipient, setNewRecipient] = useState('');

  // Adicionar novo destinatário
  const addRecipient = () => {
    if (newRecipient && !settings.recipients?.includes(newRecipient)) {
      const updatedRecipients = [...(settings.recipients || []), newRecipient];
      updateSettings({ recipients: updatedRecipients });
      setNewRecipient('');
    }
  };

  // Remover destinatário
  const removeRecipient = (email: string) => {
    const updatedRecipients = settings.recipients?.filter(r => r !== email) || [];
    updateSettings({ recipients: updatedRecipients });
  };

  // Renderizar conteúdo específico com base no schedule selecionado
  const renderScheduleOptions = () => {
    switch (settings.exportSchedule) {
      case 'weekly':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dia da Semana
              </label>
              <select
                value={settings.exportDayOfWeek || 1}
                onChange={(e) => updateSettings({ exportDayOfWeek: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
              >
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
                <option value="0">Domingo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={settings.exportTime}
                onChange={(e) => updateSettings({ exportTime: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                autoComplete="off"
              />
            </div>
          </div>
        );
      case 'monthly':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dia do Mês
              </label>
              <select
                value={settings.exportDayOfMonth || 1}
                onChange={(e) => updateSettings({ exportDayOfMonth: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={settings.exportTime}
                onChange={(e) => updateSettings({ exportTime: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                autoComplete="off"
              />
            </div>
          </div>
        );
      case 'daily':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Horário
            </label>
            <input
              type="time"
              value={settings.exportTime}
              onChange={(e) => updateSettings({ exportTime: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
              autoComplete="off"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 lg:h-[500px] overflow-y-scroll">
      {/* Configurações básicas */}
      <div className="space-y-4">
        <div>
          <label htmlFor="export-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pasta para Exportação
          </label>
          <div className="mt-1">
            <input
              id="export-path"
              type="text"
              value={settings.exportPath}
              onChange={(e) => updateSettings({ exportPath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="/pasta/exportacao"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Caminho onde os arquivos exportados serão salvos
          </p>
        </div>

        <div>
          <label htmlFor="default-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Formato Padrão
          </label>
          <div className="mt-1">
            <select
              id="default-format"
              value={settings.defaultFormat}
              onChange={(e) => updateSettings({ defaultFormat: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            >
              <option value="xlsx">Excel (XLSX)</option>
              <option value="csv">CSV</option>
              <option value="ods">OpenDocument (ODS)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="template-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ID do Template
          </label>
          <div className="mt-1">
            <input
              id="template-id"
              type="text"
              value={settings.templateId}
              onChange={(e) => updateSettings({ templateId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="template-123"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Identificador do template a ser usado na exportação (opcional)
          </p>
        </div>
      </div>

      {/* Configurações de segurança */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Segurança</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Proteger Planilhas</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Protege as planilhas contra edição não autorizada
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('protectSheets')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.protectSheets ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.protectSheets ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.protectSheets && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <label htmlFor="sheet-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha de Proteção
              </label>
              <div className="mt-1">
                <input
                  id="sheet-password"
                  type="password"
                  value={settings.password}
                  onChange={(e) => updateSettings({ password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Senha para proteger as planilhas"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Esta senha será necessária para editar as planilhas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Configurações de Exportação */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações de Exportação</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Exportar Automaticamente</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gera relatórios de forma automática e programada
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('autoExport')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.autoExport ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.autoExport ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Incluir Gráficos</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adiciona gráficos e visualizações aos relatórios
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('includeCharts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.includeCharts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.includeCharts ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Cabeçalhos Personalizados</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permite modificar os nomes das colunas na exportação
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('customHeaders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.customHeaders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.customHeaders ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.autoExport && (
            <>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Programação de Exportação
                </label>
                <select
                  value={settings.exportSchedule}
                  onChange={(e) => updateSettings({ exportSchedule: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                >
                  <option value="manual">Manual</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>

              {settings.exportSchedule !== 'manual' && (
                <div className="mt-3">
                  {renderScheduleOptions()}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Notificar ao Exportar</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enviar notificação quando os relatórios forem gerados
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSetting('notifyOnExport')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifyOnExport ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.notifyOnExport ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.notifyOnExport && (
                <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800 mt-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destinatários das Notificações
                  </label>
                  
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="email"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={addRecipient}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      disabled={!newRecipient}
                    >
                      Adicionar
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {settings.recipients?.map((email) => (
                      <div key={email} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(email)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remover"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    
                    {(!settings.recipients || settings.recipients.length === 0) && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Nenhum destinatário adicionado
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="pt-4">
        <div className="flex items-start">
          <FileSpreadsheet className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1" />
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Visualização do Relatório
            </div>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-medium">Detalhes da Exportação:</div>
                <ul className="space-y-1 mt-2 text-gray-600 dark:text-gray-400">
                  <li>• Formato: {(settings.defaultFormat ?? 'xlsx').toUpperCase()}</li>
                  <li>• Caminho: {settings.exportPath}</li>
                  <li>• Programação: {
                    settings.exportSchedule === 'manual' ? 'Manual' : 
                    settings.exportSchedule === 'daily' ? 'Diária' : 
                    settings.exportSchedule === 'weekly' ? 'Semanal' : 'Mensal'
                  }</li>
                  <li>• Gráficos: {settings.includeCharts ? 'Incluídos' : 'Não incluídos'}</li>
                  <li>• Proteção: {settings.protectSheets ? 'Ativada' : 'Desativada'}</li>
                </ul>
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
            Para exportações complexas ou personalizadas, considere definir um template específico.
            Exportações automáticas serão salvas no diretório configurado com o formato escolhido.
          </p>
        </div>
      </div>
    </div>
  );
};