/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/workflow/WorkflowSlider/index.tsx
import React, { useCallback } from 'react';
import { Clipboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { IWorkflowSliderProps } from '@/types/workflow/customize-process-by-workflow-types';

export const WorkflowSlider: React.FC<IWorkflowSliderProps> = ({
  savedWorkflows,
  currentIndex,
  onNext,
  onPrevious,
  onSelect
}) => {
  const hasNext = currentIndex < savedWorkflows.length - 1;
  const hasPrevious = currentIndex > 0;

  if (savedWorkflows.length === 0) {
    return (
      <div className="w-full bg-gray-900/50 rounded-lg p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-gray-800/50 p-4 rounded-full mb-4">
            <Clipboard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            Nenhum workflow salvo
          </h3>
          <p className="text-sm text-gray-400 max-w-md">
            Quando você criar e salvar um processo, ele aparecerá aqui para fácil acesso
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-300">
          Workflows Salvos ({savedWorkflows.length})
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="p-2 hover:bg-gray-800"
          >
            <ChevronLeft className={`h-5 w-5 ${hasPrevious ? 'text-white' : 'text-gray-600'}`} />
          </Button>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {savedWorkflows.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!hasNext}
            className="p-2 hover:bg-gray-800"
          >
            <ChevronRight className={`h-5 w-5 ${hasNext ? 'text-white' : 'text-gray-600'}`} />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {savedWorkflows.map((workflow) => (
            <div 
              key={workflow.id} 
              className="min-w-full px-2"
            >
              <Card 
                className="bg-gray-800 hover:bg-gray-700/80 cursor-pointer transition-all p-6"
                onClick={() => onSelect(workflow)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-white">{workflow.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {workflow.nodes.length} processos configurados
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {workflow.description && (
                  <p className="text-sm text-gray-400 mt-2">
                    {workflow.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <div className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                    Última modificação: {workflow.lastModified 
                      ? new Date(workflow.lastModified).toLocaleDateString()
                      : 'Nunca modificado'
                    }
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};