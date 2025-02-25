/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/workflow/WorkflowSlider/index.tsx
import React, { useCallback } from 'react';
import { Clipboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { IWorkflowSliderProps } from '@/types/workflow/customize-process-by-workflow-types';
import { WorkflowProcessCard } from './WorkflowProcessCard';

export const WorkflowSlider: React.FC<IWorkflowSliderProps> = ({
  savedWorkflows,
  currentIndex,
  onNext,
  onPrevious,
  onSelect,
  onDelete
}) => {
  const hasNext = currentIndex < savedWorkflows.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div className="w-full bg-gray-700/50 p-4">
      {/* Header mantido igual */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-300">
          Processos em Workflows Salvos ({savedWorkflows.length})
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
            {currentIndex + 1} / {Math.ceil(savedWorkflows.length / 4)}
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

      {/* Área do Slider corrigida */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(savedWorkflows.length / 5) }, (_, i) => (
            <div key={i} className="flex-none w-full">
              <div className="grid grid-cols-5 gap-4">
                {savedWorkflows.slice(i * 5, (i + 1) * 5).map((workflow) => (
                  <WorkflowProcessCard 
                    key={workflow.id}
                    workflow={workflow}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};