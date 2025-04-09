import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

interface DocSignConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocSignConfigurationDialog: React.FC<DocSignConfigurationDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [apiKey, setApiKey] = useState('');
  const [webhookURL, setWebhookURL] = useState('');
  const [environment, setEnvironment] = useState('sandbox');
  const [autoSign, setAutoSign] = useState(false);
  const [requirePatientAuth, setRequirePatientAuth] = useState(true);
  const [signerTypes, setSignerTypes] = useState<string[]>(['doctor', 'patient']);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um ambiente real, faria uma chamada à API para salvar as configurações
      console.log('Salvando configurações DocSign:', {
        apiKey,
        webhookURL,
        environment,
        autoSign,
        requirePatientAuth,
        signerTypes
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Configuração DocSign</h2>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {saveSuccess && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 rounded-lg flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ambiente</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="sandbox"
                    checked={environment === 'sandbox'}
                    onChange={() => setEnvironment('sandbox')}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Sandbox</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="production"
                    checked={environment === 'production'}
                    onChange={() => setEnvironment('production')}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Produção</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave de API</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 
                  dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Insira sua chave de API"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL do Webhook</label>
              <input
                type="text"
                value={webhookURL}
                onChange={(e) => setWebhookURL(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 
                  dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://seu-dominio.com/webhook/docsign"
              />
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configurações de Assinatura</h3>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Assinatura Automática</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Envia documentos para assinatura automaticamente após geração
                  </p>
                </div>
                <button
                  onClick={() => setAutoSign(!autoSign)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    autoSign ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    autoSign ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Autenticação de Pacientes</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requer verificação de identidade do paciente para assinatura
                  </p>
                </div>
                <button
                  onClick={() => setRequirePatientAuth(!requirePatientAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    requirePatientAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    requirePatientAuth ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipos de Assinantes</label>
              <div className="grid grid-cols-2 gap-2">
                {['doctor', 'nurse', 'patient', 'administrator'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={signerTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSignerTypes([...signerTypes, type]);
                        } else {
                          setSignerTypes(signerTypes.filter(t => t !== type));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                      {type === 'doctor' ? 'Médico' : 
                       type === 'nurse' ? 'Enfermeiro' : 
                       type === 'patient' ? 'Paciente' : 'Administrador'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    As configurações do DocSign afetam todo o fluxo de assinaturas digitais do hospital. 
                    Certifique-se de que as configurações estão corretas antes de salvar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
};