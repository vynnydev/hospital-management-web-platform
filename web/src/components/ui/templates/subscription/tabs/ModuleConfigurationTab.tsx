'use client'

import { useState } from 'react'
import { 
  Check, 
  AlertCircle, 
  Info
} from 'lucide-react'
import { useSubscription } from '@/hooks/subscription/useSubscription'
import { Button } from '@/components/ui/organisms/button'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { TModuleName } from '@/types/subscription-types'

import { ModuleList } from '../module-config/ModuleList' 
import { ModuleLegend } from '../module-config/ModuleLegend'
import { ModuleInfoAlert } from '../module-config/ModuleInfoAlert'

interface ModuleConfigurationTabProps {
  hospitalId?: string
}

export const ModuleConfigurationTab = ({ hospitalId }: ModuleConfigurationTabProps) => {
  const { 
    availableModules,
    activeModules,
    moduleOrder,
    toggleModule,
    reorderModules,
    loading,
    currentPlan
  } = useSubscription(hospitalId)
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setError] = useState<string | null>(null)
  const [currentModuleOrder, setCurrentModuleOrder] = useState<TModuleName[]>(
    moduleOrder as TModuleName[]
  )
  const [currentActiveModules, setCurrentActiveModules] = useState<string[]>(
    activeModules
  )
  
  // Função para processar o reordenamento
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(currentModuleOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCurrentModuleOrder(items as TModuleName[]);
  };
  
  // Função para alternar a visibilidade de um módulo
  const handleToggleModule = (moduleId: TModuleName) => {
    const isCurrentlyActive = currentActiveModules.includes(moduleId);
    
    let newActiveModules;
    if (isCurrentlyActive) {
      newActiveModules = currentActiveModules.filter(id => id !== moduleId);
    } else {
      newActiveModules = [...currentActiveModules, moduleId];
    }
    
    setCurrentActiveModules(newActiveModules);
  };
  
  // Função para salvar as alterações
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      // Salvar ordem dos módulos
      const orderSuccess = await reorderModules(currentModuleOrder);
      
      // Verificar módulos que foram alterados
      const modulesToUpdate = availableModules.filter(module => {
        const isEnabled = currentActiveModules.includes(module.id);
        const wasEnabled = activeModules.includes(module.id);
        return isEnabled !== wasEnabled;
      });
      
      // Atualizar visibilidade de módulos
      const togglePromises = modulesToUpdate.map(module => 
        toggleModule(module.id as TModuleName, currentActiveModules.includes(module.id))
      );
      
      const toggleResults = await Promise.all(togglePromises);
      
      // Verificar se tudo foi bem sucedido
      if (orderSuccess && toggleResults.every(result => result)) {
        setSaveSuccess(true);
        
        // Redefinir status após 3 segundos
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Ocorreu um erro ao salvar algumas alterações.');
      }
    } catch (error) {
      setError('Erro ao salvar configurações de módulos.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Verificar se há alterações pendentes
  const hasChanges = () => {
    // Verificar alterações na ordem
    if (moduleOrder.length !== currentModuleOrder.length) return true;
    for (let i = 0; i < moduleOrder.length; i++) {
      if (moduleOrder[i] !== currentModuleOrder[i]) return true;
    }
    
    // Verificar alterações na visibilidade
    if (activeModules.length !== currentActiveModules.length) return true;
    const sortedActive = [...activeModules].sort();
    const sortedCurrent = [...currentActiveModules].sort();
    for (let i = 0; i < sortedActive.length; i++) {
      if (sortedActive[i] !== sortedCurrent[i]) return true;
    }
    
    return false;
  };
  
  // Verificar se um módulo está disponível no plano atual
  const isModuleAvailableInPlan = (moduleId: string) => {
    if (!currentPlan) return false;
    return currentPlan.modules.some(m => m.id === moduleId && m.enabled);
  };
  
  return (
    <div>
      {/* Mensagem de sucesso */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{saveError}</span>
        </div>
      )}
      
      {/* Cabeçalho informativo */}
      <ModuleInfoAlert />
      
      {/* Lista de módulos */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <ModuleList 
          currentModuleOrder={currentModuleOrder}
          currentActiveModules={currentActiveModules}
          availableModules={availableModules}
          isModuleAvailableInPlan={isModuleAvailableInPlan}
          handleToggleModule={handleToggleModule}
          loading={loading}
        />
      </DragDropContext>
      
      {/* Legenda */}
      <ModuleLegend />
      
      {/* Botões de ação */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          className="border-gray-300 dark:border-gray-700"
          onClick={() => {
            setCurrentModuleOrder(moduleOrder as TModuleName[]);
            setCurrentActiveModules(activeModules);
          }}
          disabled={!hasChanges() || isSaving}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleSaveChanges}
          disabled={!hasChanges() || isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </div>
  );
};