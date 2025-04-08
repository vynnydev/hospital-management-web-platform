'use client'

import { ToggleRight, ToggleLeft, Unlock, Lock } from 'lucide-react'

export const ModuleLegend = () => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <div className="flex items-center">
        <ToggleRight className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-1" />
        <span>Ativado: Visível no menu</span>
      </div>
      <div className="flex items-center">
        <ToggleLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
        <span>Desativado: Oculto no menu</span>
      </div>
      <div className="flex items-center">
        <Unlock className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
        <span>Disponível no plano atual</span>
      </div>
      <div className="flex items-center">
        <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
        <span>Indisponível (upgrade necessário)</span>
      </div>
    </div>
  );
};