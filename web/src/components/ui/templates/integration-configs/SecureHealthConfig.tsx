/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Save, 
  Check, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Key, 
  FileText, 
  Server,
  Database,
  UserCheck,
  Clock,
  Search
} from 'lucide-react';
import { authService } from '@/services/auth/AuthService';

interface SecureHealthConfigProps {
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const SecureHealthConfig: React.FC<SecureHealthConfigProps> = ({ 
  isActive, 
  onToggle, 
  onClose 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [configData, setConfigData] = useState({
    // Configurações Básicas
    apiKey: '',
    scanFrequency: 'daily',
    scanScope: 'full',
    
    // Opções de Segurança
    enableDataEncryption: true,
    enableAccessControl: true,
    enableActivityAudit: true,
    enableThreatDetection: true,
    enableVulnerabilityScan: true,
    enableComplianceCheck: true,
    
    // Alertas
    alertMedium: true,
    alertHigh: true,
    alertCritical: true,
    alertToEmail: true,
    alertToTeams: false,
    alertToSlack: false,
    
    // Avançado
    retentionPeriod: 90,
    dataAnonymization: false,
    autoRemediate: false,
    scanSensitiveData: true,
    limitScanToBusinessHours: false,
    enableDeepScan: false
  });

  const isAdmin = authService.isAdministrator();

  const handleChange = (field: string, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um ambiente real, faria uma chamada à API
      console.log('Configurações do SecureHealth salvas:', configData);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Componente de opção de segurança
  const SecurityOption = ({ 
    id, 
    title, 
    description, 
    icon 
  }: { 
    id: string; 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
  }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => handleChange(id, !configData[id as keyof typeof configData])}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          configData[id as keyof typeof configData] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          configData[id as keyof typeof configData] ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-7xl w-full lg:h-[500px] overflow-y-scroll">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">SecureHealth</h2>
            <p className="text-sm text-white/80">Verificação de segurança de dados médicos</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isActive 
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' 
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
            }`}
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span>Configurações de segurança salvas com sucesso!</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Configurações Básicas
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chave de API SecureHealth
            </label>
            <input
              type="password"
              value={configData.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••••••••••••••••••"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Você pode obter sua chave de API no portal do SecureHealth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequência de Verificação
              </label>
              <select
                value={configData.scanFrequency}
                onChange={(e) => handleChange('scanFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensalmente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Escopo da Verificação
              </label>
              <select
                value={configData.scanScope}
                onChange={(e) => handleChange('scanScope', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="full">Completo (Todos os dados)</option>
                <option value="incremental">Incremental (Apenas novos dados)</option>
                <option value="critical">Apenas dados críticos</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Opções de Segurança
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecurityOption 
              id="enableDataEncryption"
              title="Criptografia de Dados"
              description="Criptografa dados sensíveis de pacientes"
              icon={<Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            />
            
            <SecurityOption 
              id="enableAccessControl"
              title="Controle de Acesso"
              description="Verifica permissões de acesso a dados"
              icon={<Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            />
            
            <SecurityOption 
              id="enableActivityAudit"
              title="Auditoria de Atividades"
              description="Registra e analisa atividades dos usuários"
              icon={<Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            />
            
            <SecurityOption 
              id="enableThreatDetection"
              title="Detecção de Ameaças"
              description="Identifica padrões suspeitos de acesso"
              icon={<AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
            />
            
            <SecurityOption 
              id="enableVulnerabilityScan"
              title="Verificação de Vulnerabilidades"
              description="Verifica fraquezas no sistema"
              icon={<Server className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            />
            
            <SecurityOption 
              id="enableComplianceCheck"
              title="Verificação de Conformidade"
              description="Garante conformidade com regulamentações de saúde"
              icon={<FileText className="w-5 h-5 text-green-600 dark:text-green-400" />}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Configurações de Alertas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Níveis de Alerta</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Médio</span>
                  </div>
                  <button
                    onClick={() => handleChange('alertMedium', !configData.alertMedium)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.alertMedium ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.alertMedium ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Alto</span>
                  </div>
                  <button
                    onClick={() => handleChange('alertHigh', !configData.alertHigh)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.alertHigh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.alertHigh ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Crítico</span>
                  </div>
                  <button
                    onClick={() => handleChange('alertCritical', !configData.alertCritical)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.alertCritical ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.alertCritical ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Canais de Notificação</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                  <button
                    onClick={() => handleChange('alertToEmail', !configData.alertToEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.alertToEmail ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.alertToEmail ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Microsoft Teams</span>
                  <button
                    onClick={() => handleChange('alertToTeams', !configData.alertToTeams)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.alertToTeams ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.alertToTeams ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Slack</span>
                  <button
                    onClick={() => handleChange('alertToSlack', !configData.alertToSlack)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.alertToSlack ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.alertToSlack ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
              <span>Configurações Avançadas</span>
              <span className="ml-2 py-0.5 px-2 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Apenas Administradores
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Período de Retenção de Logs (dias)
                </label>
                <select
                  value={configData.retentionPeriod.toString()}
                  onChange={(e) => handleChange('retentionPeriod', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="30">30 dias</option>
                  <option value="60">60 dias</option>
                  <option value="90">90 dias</option>
                  <option value="180">180 dias</option>
                  <option value="365">365 dias</option>
                </select>
              </div>
              
              <SecurityOption 
                id="dataAnonymization"
                title="Anonimização de Dados"
                description="Anonimiza dados sensíveis de pacientes nas verificações"
                icon={<UserCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
              />
              
              <SecurityOption 
                id="autoRemediate"
                title="Correção Automática"
                description="Corrige automaticamente vulnerabilidades encontradas"
                icon={<ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              />
              
              <SecurityOption 
                id="scanSensitiveData"
                title="Verificação de Dados Sensíveis"
                description="Verifica dados de saúde protegidos (PHI)"
                icon={<Database className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              />
              
              <SecurityOption 
                id="limitScanToBusinessHours"
                title="Limitar a Horário Comercial"
                description="Executar verificações apenas em horário comercial"
                icon={<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              />
              
              <SecurityOption 
                id="enableDeepScan"
                title="Verificação Profunda"
                description="Realiza verificações mais detalhadas (maior impacto no desempenho)"
                icon={<Search className="w-5 h-5 text-violet-600 dark:text-violet-400" />}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Importante</h4>
            <p className="text-sm text-red-500 dark:text-red-300 mt-1">
              SecureHealth verificará a segurança dos dados médicos e emitirá alertas para possíveis vulnerabilidades.
              Esta ferramenta ajuda a garantir a conformidade com regulamentações de proteção de dados da saúde,
              mas não substitui políticas de segurança abrangentes.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end items-center border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 inline-block" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};