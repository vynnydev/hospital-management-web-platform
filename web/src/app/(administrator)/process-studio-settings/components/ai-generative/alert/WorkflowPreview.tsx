import { GitBranch } from "lucide-react";

export const WorkflowPreview = () => (
    <div className="border rounded-lg p-3 bg-gray-800/50 border-gray-700">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Fluxo: Admissão de Emergência</h4>
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex-1 text-center bg-gray-700/50 rounded-md p-2 text-gray-300">Triagem</div>
        <div className="w-6 flex justify-center">
          <GitBranch className="h-4 w-4 text-gray-500 rotate-90" />
        </div>
        <div className="flex-1 text-center bg-gray-700/50 rounded-md p-2 text-gray-300">Avaliação Médica</div>
        <div className="w-6 flex justify-center">
          <GitBranch className="h-4 w-4 text-gray-500 rotate-90" />
        </div>
        <div className="flex-1 text-center bg-gray-700/50 rounded-md p-2 text-gray-300">Exames</div>
        <div className="w-6 flex justify-center">
          <GitBranch className="h-4 w-4 text-gray-500 rotate-90" />
        </div>
        <div className="flex-1 text-center bg-gray-700/50 rounded-md p-2 text-gray-300">Conduta</div>
      </div>
      <div className="mt-4 text-xs text-gray-400 bg-gray-800 rounded-md p-3 border border-gray-700">
        <div className="flex justify-between mb-1">
          <span>Tempo estimado:</span>
          <span className="text-gray-300">45 minutos</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Pontos críticos:</span>
          <span className="text-gray-300">2</span>
        </div>
        <div className="flex justify-between">
          <span>Recursos necessários:</span>
          <span className="text-gray-300">4</span>
        </div>
      </div>
    </div>
);