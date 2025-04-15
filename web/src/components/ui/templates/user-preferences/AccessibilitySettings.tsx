/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Eye, Bell, MessageSquare, AlertTriangle, Check, ZoomIn, Save } from 'lucide-react';
import { useUserPreferences } from '@/services/hooks/use-preferences/useUserPreferences';
import { authService } from '@/services/auth/AuthService';

// Definição correta da interface de props
interface AccessibilitySettingsProps {
  section: 'visual' | 'alerts' | 'captions';
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ section }) => {
  const { preferences, updateAccessibility } = useUserPreferences();
  const [settings, setSettings] = useState({
    highContrast: preferences?.accessibility?.highContrast || false,
    visualAlerts: preferences?.accessibility?.visualAlerts || true,
    closedCaptions: preferences?.accessibility?.closedCaptions || true,
    textSize: preferences?.accessibility?.textSize || 'medium'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const user = authService.getCurrentUser();

  // Sincronizar estado local com as preferências do usuário
  useEffect(() => {
    if (preferences?.accessibility) {
      setSettings({
        highContrast: preferences.accessibility.highContrast,
        visualAlerts: true,
        closedCaptions: true,
        textSize: preferences.accessibility.textSize
      });
    }
  }, [preferences]);

  // Função para salvar as configurações
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await updateAccessibility(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações de acessibilidade:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: 'highContrast' | 'visualAlerts' | 'closedCaptions') => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Função para atualizar o tamanho do texto
  const updateTextSize = (size: 'small' | 'medium' | 'large') => {
    setSettings(prev => ({
      ...prev,
      textSize: size
    }));
  };

  // Renderiza o conteúdo com base na seção selecionada
  const renderContent = () => {
    switch (section) {
      case 'visual':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">Configurações Visuais</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Alto Contraste</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Aumenta o contraste dos elementos para melhor visibilidade
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('highContrast')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-gray-900 dark:text-white">Tamanho do Texto</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Ajusta o tamanho do texto em toda a aplicação
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => updateTextSize('small')}
                    className={`py-2 px-4 rounded border ${
                      settings.textSize === 'small'
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Pequeno
                  </button>
                  <button
                    onClick={() => updateTextSize('medium')}
                    className={`py-2 px-4 rounded border ${
                      settings.textSize === 'medium'
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Médio
                  </button>
                  <button
                    onClick={() => updateTextSize('large')}
                    className={`py-2 px-4 rounded border ${
                      settings.textSize === 'large'
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Grande
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-start">
                  <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Visualização de Exemplo
                    </div>
                    <div className={`mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                      ${settings.highContrast ? 'contrast-[1.5]' : ''} 
                      ${settings.textSize === 'small' ? 'text-sm' : 
                        settings.textSize === 'large' ? 'text-lg' : 'text-base'}`}>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Diagnóstico do Paciente
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        Este é um exemplo de como os textos aparecerão na aplicação com as configurações atuais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'alerts':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">Alertas</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Alertas Visuais</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Exibe notificações visuais para alertas importantes
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('visualAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.visualAlerts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.visualAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="pt-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exemplos de Alertas
                    </div>
                    <div className="mt-2 space-y-3">
                      <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-400 ${
                        !settings.visualAlerts ? 'opacity-50' : ''
                      }`}>
                        <div className="flex items-center">
                          <Bell className="w-5 h-5 mr-2" />
                          <span className="font-medium">Lembrete de Consulta</span>
                        </div>
                        <p className="mt-1 text-sm">
                          Consulta do paciente Maria Silva agendada para 14:30.
                        </p>
                      </div>

                      <div className={`p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-400 ${
                        !settings.visualAlerts ? 'opacity-50' : ''
                      }`}>
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          <span className="font-medium">Alerta Crítico</span>
                        </div>
                        <p className="mt-1 text-sm">
                          Conflito de medicação detectado para o paciente João Pereira.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'captions':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">Legendas</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Legendas Fechadas</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Ativa legendas para conteúdo de áudio e vídeo
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('closedCaptions')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.closedCaptions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.closedCaptions ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="pt-4">
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exemplo de Legenda
                    </div>
                    <div className="mt-2">
                      <div className="relative w-full rounded-lg overflow-hidden bg-gray-900 aspect-video">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-white text-center">
                            <ZoomIn className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-gray-300">Simulação de vídeo</p>
                          </div>
                        </div>
                        
                        {settings.closedCaptions && (
                          <div className="absolute bottom-4 left-0 right-0 mx-auto px-4">
                            <div className="bg-black/70 text-white text-center py-2 px-4 rounded max-w-sm mx-auto">
                              <p className="text-sm">O médico está explicando o procedimento ao paciente.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {authService.isDoctor() && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mt-6">
                  <p className="font-medium mb-1">Nota para Médicos</p>
                  <p>As legendas são especialmente úteis durante teleconsultas para garantir que as informações sejam acessíveis para pacientes com deficiência auditiva.</p>
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {saveSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 rounded-lg flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}
      
      <div className="space-y-6">
        {renderContent()}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              <span>Salvar Configurações</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};