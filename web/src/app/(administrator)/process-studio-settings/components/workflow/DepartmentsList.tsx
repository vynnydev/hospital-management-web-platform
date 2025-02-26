import React, { useState, useEffect } from 'react';
import { IWorkflowDepartment } from '@/types/workflow/customize-process-by-workflow-types';

interface DepartmentsListProps {
  departments: IWorkflowDepartment[];
  workflowInProgress: boolean;
  currentWorkflowName?: string;
  onStartWorkflow: (department: IWorkflowDepartment) => void;
  onCancelWorkflow: () => void;
}

export const DepartmentsList: React.FC<DepartmentsListProps> = ({
  departments,
  workflowInProgress,
  currentWorkflowName = '',
  onStartWorkflow,
  onCancelWorkflow
}) => {
  // Estado local para controlar se os departamentos estão desabilitados
  const [departmentsDisabled, setDepartmentsDisabled] = useState<boolean>(workflowInProgress);
  
  // Estado para armazenar o nome do fluxo de trabalho atual
  const [processName, setProcessName] = useState<string>(currentWorkflowName);
  
  // Estado para controlar se há um processo ativo (mesmo se não vier das props)
  const [hasActiveProcess, setHasActiveProcess] = useState<boolean>(workflowInProgress);
  
  // Atualiza o estado quando workflowInProgress muda
  useEffect(() => {
    console.log("DepartmentsList: workflowInProgress mudou para", workflowInProgress);
    setDepartmentsDisabled(workflowInProgress);
    setHasActiveProcess(workflowInProgress);
    
    // Se o processo for iniciado, atualiza o nome do processo
    if (workflowInProgress && currentWorkflowName) {
      setProcessName(currentWorkflowName);
    }
  }, [workflowInProgress, currentWorkflowName]);
  
  // Ouve eventos de workflow iniciado/cancelado para sincronização
  useEffect(() => {
    const handleProcessStarted = (e: Event) => {
      console.log("DepartmentsList: Processo iniciado");
      const detail = (e as CustomEvent).detail;
      
      setDepartmentsDisabled(true);
      setHasActiveProcess(true);
      
      // Atualiza o nome do processo se disponível no evento
      if (detail?.name) {
        setProcessName(detail.name);
      }
    };
    
    const handleProcessCanceled = () => {
      console.log("DepartmentsList: Processo cancelado");
      setDepartmentsDisabled(false);
      setHasActiveProcess(false);
      setProcessName('');
    };
    
    // Adiciona listeners para eventos personalizados
    window.addEventListener('workflow-process-started', handleProcessStarted);
    window.addEventListener('workflow-process-canceled', handleProcessCanceled);
    
    // Limpa listeners ao desmontar
    return () => {
      window.removeEventListener('workflow-process-started', handleProcessStarted);
      window.removeEventListener('workflow-process-canceled', handleProcessCanceled);
    };
  }, []);

  // Manipulador para iniciar um novo workflow
  const handleStartWorkflow = (department: IWorkflowDepartment) => {
    if (!departmentsDisabled) {
      console.log("DepartmentsList: Iniciando workflow", department.label);
      setHasActiveProcess(true);
      setProcessName(department.label);
      onStartWorkflow(department);
      setDepartmentsDisabled(true);
    }
  };
  
  // Manipulador para cancelar o workflow atual
  const handleCancelWorkflow = () => {
    console.log("DepartmentsList: Cancelando workflow");
    onCancelWorkflow();
    setDepartmentsDisabled(false);
    setHasActiveProcess(false);
    setProcessName('');
  };

  // Determina se deve mostrar o status de processo em andamento
  // Agora usando hasActiveProcess que captura qualquer forma de ativação
  const showProcessStatus = hasActiveProcess || workflowInProgress;

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col h-full border-r border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Departamentos Disponíveis</h3>
      
      {/* Lista de departamentos */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {departments.map((dept) => {
          const Icon = dept.icon;
          const isDisabled = departmentsDisabled;
          
          return (
            <button
              key={dept.id}
              onClick={() => handleStartWorkflow(dept)}
              disabled={isDisabled}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors
                ${isDisabled 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            >
              <div className={`p-2 rounded-lg ${dept.color ? `bg-${dept.color}-500/10` : 'bg-blue-500/10'}`}>
                <Icon className={`h-5 w-5 ${dept.color ? `text-${dept.color}-400` : 'text-blue-400'}`} />
              </div>
              <div>
                <div className="font-medium">{dept.label}</div>
                {dept.subtitle && (
                  <div className="text-sm text-gray-400">{dept.subtitle}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Informação de workflow em andamento - SEMPRE habilitado quando há processo */}
      {showProcessStatus && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="mb-2">
            <div className="text-gray-400 text-sm">Um processo está em andamento</div>
            <div className="text-white font-medium">
              {processName || currentWorkflowName || "Processo em andamento"}
            </div>
          </div>
          {/* Botão com estilos explícitos para garantir que sempre pareça ativo */}
          <button
            onClick={handleCancelWorkflow}
            className="cancel-process-button"
            style={{ 
              opacity: 1,
              pointerEvents: 'auto'
            }}
          >
            Cancelar Processo
          </button>
        </div>
      )}
    </div>
  );
};