import { ChevronLeft, ChevronRight, Eye, Trash2, Workflow } from "lucide-react";
import { ISavedWorkflow } from "../types/workflow-types";

// Componente de Slider de Workflows
export const WorkflowSlider = ({ 
    workflows, 
    currentSlide, 
    onPrevious, 
    onNext,
    onLoadWorkflow,
    onDeleteWorkflow 
  }: {
    workflows: ISavedWorkflow[];
    currentSlide: number;
    onPrevious: () => void;
    onNext: () => void;
    onLoadWorkflow: (workflow: ISavedWorkflow) => void;
    onDeleteWorkflow: (id: string) => void;
  }) => {
    if (workflows.length === 0) {
      return (
        <div className="w-full h-24 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <p className="text-gray-500 text-sm">
            Nenhum processo salvo. Crie seu primeiro workflow!
          </p>
        </div>
      );
    }
  
    const currentWorkflow = workflows[currentSlide];
  
    return (
      <div className="w-full h-24 bg-gray-900/50 rounded-lg flex items-center px-4 relative">
        {/* Botão de navegação esquerda */}
        <button 
          onClick={onPrevious}
          className="absolute left-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="text-white" />
        </button>
  
        {/* Card do Workflow */}
        <div className="flex-1 flex items-center justify-between mx-12">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Workflow className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{currentWorkflow.name}</h3>
              <p className="text-gray-400 text-sm">
                Criado em {currentWorkflow.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
  
          <div className="flex space-x-2">
            <button 
              onClick={() => onLoadWorkflow(currentWorkflow)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Eye className="mr-2" size={18} />
              Carregar
            </button>
            <button 
              onClick={() => onDeleteWorkflow(currentWorkflow.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
  
        {/* Botão de navegação direita */}
        <button 
          onClick={onNext}
          className="absolute right-2 z-10 bg-gray-800/70 hover:bg-gray-700/70 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    );
};