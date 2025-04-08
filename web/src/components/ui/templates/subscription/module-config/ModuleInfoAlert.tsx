'use client'

import { Info, AlertCircle } from 'lucide-react'

export const ModuleInfoAlert = () => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      {/* Alerta principal */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-400">
              Configuração de Módulos
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              Arraste os módulos para reordená-los e defina quais devem ficar visíveis no menu principal.
              Apenas os módulos disponíveis em seu plano atual podem ser ativados.
            </p>
          </div>
        </div>
      </div>
      
      {/* Alerta sobre módulos indisponíveis */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-700 dark:text-yellow-400">
              Módulos Indisponíveis
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
              Alguns módulos estão disponíveis apenas em planos superiores. Faça upgrade do seu plano para acessar todos os recursos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};