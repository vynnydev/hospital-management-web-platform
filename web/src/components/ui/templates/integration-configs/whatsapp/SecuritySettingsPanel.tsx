import React, { useState } from 'react';
import { Save, Shield, Lock, Plus, X } from 'lucide-react';

interface SecuritySettings {
  endToEndEncryption: boolean;
  twoFactorAuth: boolean;
  ipWhitelist: string[];
  messageRetentionDays: number;
}

interface SecuritySettingsPanelProps {
  securitySettings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = ({
  securitySettings,
  onChange
}) => {
  const [newIpAddress, setNewIpAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Estado local para edição
  const [settings, setSettings] = useState<SecuritySettings>({
    ...securitySettings
  });
  
  // Funções de atualização de estado
  const toggleSetting = (setting: keyof SecuritySettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as 'endToEndEncryption' | 'twoFactorAuth']
    }));
  };
  
  const handleIPWhitelistChange = (ipList: string[]) => {
    setSettings(prev => ({
      ...prev,
      ipWhitelist: ipList
    }));
  };
  
  const handleRetentionChange = (days: number) => {
    setSettings(prev => ({
      ...prev,
      messageRetentionDays: days
    }));
  };
  
  // Adicionar novo IP à whitelist
  const addIpToWhitelist = () => {
    if (newIpAddress && !settings.ipWhitelist.includes(newIpAddress)) {
      // Validação simples de formato de IP
      const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (ipPattern.test(newIpAddress)) {
        handleIPWhitelistChange([...settings.ipWhitelist, newIpAddress]);
        setNewIpAddress('');
      }
    }
  };
  
  // Remover IP da whitelist
  const removeIpFromWhitelist = (ip: string) => {
    handleIPWhitelistChange(settings.ipWhitelist.filter(item => item !== ip));
  };
  
  // Salvar configurações
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simular uma chamada assíncrona
    setTimeout(() => {
      onChange(settings);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configurações de Segurança</h3>
        <button
          type="button"
          onClick={saveSettings}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center">
          <div className="mr-2 p-1 bg-green-200 dark:bg-green-800 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Configurações salvas com sucesso!
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Proteção de Mensagens
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Configurações de segurança para proteção de mensagens e conteúdo
          </p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Criptografia de Ponta a Ponta</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ativa a criptografia de mensagens entre o WhatsApp e os sistemas integrados
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('endToEndEncryption')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.endToEndEncryption ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.endToEndEncryption ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Autenticação em Dois Fatores</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requer autenticação adicional para acesso à API do WhatsApp
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('twoFactorAuth')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Lista de IPs Permitidos</h4>
            </div>
            
            <div className="flex mb-3">
              <input
                type="text"
                value={newIpAddress}
                onChange={(e) => setNewIpAddress(e.target.value)}
                placeholder="Ex: 192.168.1.1"
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-md"
              />
              <button
                type="button"
                onClick={addIpToWhitelist}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 p-3 min-h-[100px]">
              {settings.ipWhitelist.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {settings.ipWhitelist.map(ip => (
                    <div 
                      key={ip}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                      <span>{ip}</span>
                      <button
                        type="button"
                        onClick={() => removeIpFromWhitelist(ip)}
                        className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-3">
                  Nenhum IP adicionado. Adicione IPs para restringir o acesso à API.
                </p>
              )}
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Se nenhum IP for adicionado, todas as origens serão permitidas.
            </p>
          </div>
          
          <div className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Retenção de Mensagens</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Define por quanto tempo as mensagens serão armazenadas antes de serem automaticamente excluídas
            </p>
            
            <div className="mb-1 flex items-center space-x-3">
              <input 
                type="range" 
                min="7" 
                max="365" 
                step="1"
                value={settings.messageRetentionDays}
                onChange={(e) => handleRetentionChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white w-16">
                {settings.messageRetentionDays} dias
              </span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>7 dias</span>
              <span>30 dias</span>
              <span>90 dias</span>
              <span>180 dias</span>
              <span>365 dias</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
        <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Informações de Segurança</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
            As configurações de segurança ajudam a proteger os dados e conversas dos usuários. 
            Alterar estas configurações pode afetar a conectividade com a API do WhatsApp Business. 
            Recomendamos manter a criptografia ativada e definir uma política de retenção de dados 
            alinhada com as regulamentações locais de proteção de dados.
          </p>
        </div>
      </div>
    </div>
  );
};