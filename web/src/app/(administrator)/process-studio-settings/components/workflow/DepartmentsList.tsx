// src/components/workflow/DepartmentsList/index.tsx
import React from 'react';
import { IWorkflowDepartment } from '@/types/workflow/customize-process-by-workflow-types';

interface DepartmentsListProps {
  departments: IWorkflowDepartment[];
  workflowInProgress: boolean;
  currentWorkflowName: string;
  onStartWorkflow: (dept: IWorkflowDepartment) => void;
  onCancelWorkflow: () => void;
}

export const DepartmentsList: React.FC<DepartmentsListProps> = ({
  departments,
  workflowInProgress,
  currentWorkflowName,
  onStartWorkflow,
  onCancelWorkflow
}) => {
  return (
    <div className="w-64 bg-gray-900/50 px-4 py-2 border-r border-gray-800 overflow-y-auto relative">
      {workflowInProgress && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <p className="text-white/70 text-sm mb-2">
            Um processo está em andamento
          </p>
          <p className="text-white font-medium">
            {currentWorkflowName}
          </p>
          <button 
            onClick={onCancelWorkflow}
            className="mt-4 text-red-400 hover:text-red-300 text-sm"
          >
            Cancelar Processo
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-400">
          Departamentos Disponíveis
        </h3>
      </div>

      <div className="space-y-2">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.id}
              className={`flex items-center gap-3 p-3 rounded-lg border border-gray-700 
                ${workflowInProgress 
                  ? 'bg-gray-900/50 cursor-not-allowed opacity-50' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer'
                }`}
              onClick={() => !workflowInProgress && onStartWorkflow(dept)}
            >
              <div className="p-2 rounded-md bg-blue-500/10">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{dept.label}</h4>
                <p className="text-xs text-gray-400">{dept.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};