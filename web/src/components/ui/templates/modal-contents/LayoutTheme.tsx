import React from 'react';
import { useTheme } from 'next-themes';
import { Computer, Moon, Sun } from 'lucide-react';

interface ThemeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const LayoutTheme = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions: ThemeOption[] = [
    {
      id: 'system',
      label: 'Sistema',
      icon: <Computer className="w-6 h-6" />,
      description: 'Acompanha as configurações do sistema'
    },
    {
      id: 'light',
      label: 'Claro',
      icon: <Sun className="w-6 h-6" />,
      description: 'Aparência clara para uso diurno'
    },
    {
      id: 'dark',
      label: 'Escuro',
      icon: <Moon className="w-6 h-6" />,
      description: 'Aparência escura para uso noturno'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tema da Interface</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Escolha como você prefere visualizar a aplicação
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              ${theme === option.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            {theme === option.id && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
            )}
            
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`
                p-2 rounded-full
                ${theme === option.id
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}>
                {option.icon}
              </div>
              
              <div className="space-y-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className={`
                  h-20 w-full bg-cover bg-center
                  ${option.id === 'system' ? 'bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900' :
                    option.id === 'light' ? 'bg-gradient-to-r from-gray-100 to-white' :
                    'bg-gradient-to-r from-gray-800 to-gray-900'}
                `} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};