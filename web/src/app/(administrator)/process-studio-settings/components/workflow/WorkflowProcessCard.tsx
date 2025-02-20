// src/components/workflow/WorkflowSlider/WorkflowProcessCard.tsx
import React from 'react';
import { Users, Clock, X } from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { ISavedWorkflow } from '@/types/workflow/customize-process-by-workflow-types';

interface WorkflowProcessCardProps {
  workflow: ISavedWorkflow;
  onSelect: (workflow: ISavedWorkflow) => void;
  onDelete: (workflowId: string) => void;
}

export const WorkflowProcessCard: React.FC<WorkflowProcessCardProps> = ({
  workflow,
  onSelect,
  onDelete
}) => {
  return (
    <Card 
      className="relative w-72 bg-gray-800 hover:bg-gray-800/90 transition-all p-4 
                 cursor-pointer group border-0 overflow-hidden"
      onClick={() => onSelect(workflow)}
      style={{
        background: 'linear-gradient(to bottom right, rgb(30, 41, 59), rgb(30, 41, 59))',
      }}
    >
      {/* Borda Gradiente */}
      <div className="absolute inset-0 border rounded-lg border-transparent bg-gradient-to-r from-blue-700 to-cyan-700 opacity-20 group-hover:opacity-30 transition-opacity" />

      {/* Botão de Remoção */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(workflow.id);
        }}
        className="absolute top-4 right-2 bg-red-500 text-white rounded-full w-6 h-6 
                    flex items-center justify-center z-10 hover:bg-red-600"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Conteúdo Principal */}
      <div className="space-y-3">
        {/* Título e Descrição */}
        <div>
          <h4 className="text-lg font-semibold text-white truncate">{workflow.name}</h4>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{workflow.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {workflow.nodes.length} processos
          </span>
          {workflow.lastModified && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Modificado
            </span>
          )}
          {workflow.nodes.length > 5 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Complexo
            </span>
          )}
        </div>

        {/* Metadados */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {workflow.nodes.length}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {new Date(workflow.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Overlay de Hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent 
                   opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
      />
    </Card>
  );
};