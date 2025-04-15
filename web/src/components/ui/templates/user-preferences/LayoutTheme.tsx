import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useUserPreferences } from '@/hooks/use-preferences/useUserPreferences';
import { authService } from '@/services/general/auth/AuthService';

export const LayoutTheme: React.FC = () => {
  const { preferences, updateTheme } = useUserPreferences();
  const [activeTheme, setActiveTheme] = useState<'system' | 'light' | 'dark'>(
    preferences?.theme || 'system'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const user = authService.getCurrentUser();

  // Sincroniza com as preferências quando elas forem carregadas
  useEffect(() => {
    if (preferences?.theme) {
      setActiveTheme(preferences.theme);
    }
  }, [preferences]);

  const handleThemeChange = async (theme: 'system' | 'light' | 'dark') => {
    setActiveTheme(theme);
    setIsSaving(true);
    
    try {
      await updateTheme(theme);
      
      // Simula a atualização bem-sucedida
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Aplicar o tema imediatamente (em ambiente real, isso seria gerenciado pelo sistema de tema)
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Tema da Interface</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Escolha como você prefere visualizar a aplicação. O tema afeta todas as telas do sistema.
        </p>
        
        {saveSuccess && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 rounded-lg flex items-center mb-6">
            <Check className="w-5 h-5 mr-2" />
            <span>Tema atualizado com sucesso!</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Opção Sistema */}
          <div 
            onClick={() => handleThemeChange('system')}
            className={`
              border rounded-xl p-6 cursor-pointer transition-all duration-200
              ${activeTheme === 'system' 
                ? 'border-blue-500 ring-2 ring-blue-500/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
            `}
          >
            <div className="flex justify-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center 
                ${activeTheme === 'system' 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
              `}>
                <Monitor className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Sistema</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Acompanha as configurações do sistema
              </p>
            </div>
          </div>
          
          {/* Opção Claro */}
          <div 
            onClick={() => handleThemeChange('light')}
            className={`
              border rounded-xl p-6 cursor-pointer transition-all duration-200
              ${activeTheme === 'light' 
                ? 'border-blue-500 ring-2 ring-blue-500/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
            `}
          >
            <div className="flex justify-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center 
                ${activeTheme === 'light' 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
              `}>
                <Sun className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Claro</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Aparência clara para uso diurno
              </p>
            </div>
          </div>
          
          {/* Opção Escuro */}
          <div 
            onClick={() => handleThemeChange('dark')}
            className={`
              border rounded-xl p-6 cursor-pointer transition-all duration-200
              ${activeTheme === 'dark' 
                ? 'border-blue-500 ring-2 ring-blue-500/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
            `}
          >
            <div className="flex justify-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center 
                ${activeTheme === 'dark' 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
              `}>
                <Moon className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Escuro</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Aparência escura para uso noturno
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dicas para uso do tema */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 text-sm text-blue-800 dark:text-blue-300">
        <h4 className="font-medium mb-2">Dica Pro</h4>
        <p>O modo escuro reduz a emissão de luz azul e pode ajudar a reduzir a fadiga ocular durante o uso prolongado do sistema, especialmente em ambientes com pouca iluminação.</p>
      </div>
      
      {/* Conteúdo específico para médicos */}
      {authService.isDoctor() && (
        <div className="mt-8 p-5 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Nota para Médicos</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Em salas de exame com iluminação controlada, recomendamos o tema escuro para melhor visualização de imagens diagnósticas e para evitar desconforto ao alternar entre o sistema e outros dispositivos médicos.
          </p>
        </div>
      )}
    </div>
  );
};