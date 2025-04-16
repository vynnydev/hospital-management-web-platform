'use client'

import { GripVertical, Lock, Unlock } from 'lucide-react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Switch } from '@headlessui/react'
import { IPlatformModule, TModuleName } from '@/types/subscription-types'

interface ModuleListProps {
  currentModuleOrder: TModuleName[];
  currentActiveModules: string[];
  availableModules: IPlatformModule[];
  isModuleAvailableInPlan: (moduleId: string) => boolean;
  handleToggleModule: (moduleId: TModuleName) => void;
  loading: boolean;
}

export const ModuleList = ({
  currentModuleOrder,
  currentActiveModules,
  availableModules,
  isModuleAvailableInPlan,
  handleToggleModule,
  loading
}: ModuleListProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500 dark:text-gray-400">
          <div className="col-span-1"></div>
          <div className="col-span-6 sm:col-span-4">Módulo</div>
          <div className="hidden sm:block col-span-4">Descrição</div>
          <div className="col-span-4 sm:col-span-2">Visibilidade</div>
          <div className="col-span-1">Status</div>
        </div>
      </div>
      
      <Droppable droppableId="modules">
        {(provided) => (
          <div
            className="pb-1"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {currentModuleOrder.map((moduleId, index) => {
              const foundModule = availableModules.find(m => m.id === moduleId) || {
                id: moduleId,
                name: moduleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: 'Descrição não disponível',
                enabled: false,
                order: index,
                features: []
              };
              
              const isActive = currentActiveModules.includes(moduleId);
              const isAvailable = isModuleAvailableInPlan(moduleId);
              return (
                <Draggable key={moduleId} draggableId={moduleId} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        border-b border-gray-100 dark:border-gray-800 py-4 px-4
                        ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
                      `}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 flex justify-center" {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-600 cursor-move" />
                        </div>
                        
                        <div className="col-span-6 sm:col-span-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {foundModule.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                            {foundModule.description}
                          </div>
                        </div>
                        
                        <div className="hidden sm:block col-span-4 text-sm text-gray-500 dark:text-gray-400">
                          {foundModule.description}
                        </div>
                        
                        <div className="col-span-4 sm:col-span-2 flex justify-center">
                          <Switch
                            checked={isActive}
                            onChange={() => handleToggleModule(moduleId as TModuleName)}
                            disabled={!isAvailable || loading}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full
                              ${!isAvailable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                              ${isActive 
                                ? 'bg-indigo-600 dark:bg-indigo-500' 
                                : 'bg-gray-200 dark:bg-gray-700'}
                            `}
                          >
                            <span className="sr-only">
                              {isActive ? 'Desativar' : 'Ativar'} {foundModule.name}
                            </span>
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition
                                ${isActive ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </Switch>
                        </div>
                        
                        <div className="col-span-1 flex justify-center">
                          {isAvailable ? (
                            <span className="flex items-center text-green-500 dark:text-green-400">
                              <Unlock className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-400 dark:text-gray-600" title="Não disponível no plano atual">
                              <Lock className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};