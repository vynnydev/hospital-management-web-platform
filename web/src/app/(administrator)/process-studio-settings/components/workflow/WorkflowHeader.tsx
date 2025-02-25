// src/components/workflow/WorkflowHeader/index.tsx
import React from 'react';
import { Workflow, MoreVertical, Brain, Users, Link, Save, Download, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/organisms/dropdown-menu';

interface WorkflowHeaderProps {
  onSaveClick: () => void;
  onCreateCollaboration: () => void;
  onJoinCollaboration: () => void;
  onAIAnalysis: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exportFormat: 'json' | 'csv';
  onExportFormatChange: (format: 'json' | 'csv') => void;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  onSaveClick,
  onCreateCollaboration,
  onJoinCollaboration,
  onAIAnalysis,
  onExport,
  onImport,
  exportFormat,
  onExportFormatChange
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-800 rounded-t-xl">
      <div className="flex items-center space-x-4">
        <Workflow className="h-6 w-6 text-blue-400" />
        <h1 className="text-xl font-bold text-white">
          Criar ou Editar Processos Hospitalares pelo Workflow
        </h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-800">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuItem onClick={onCreateCollaboration} className="text-white hover:bg-gray-700">
              <Users className="mr-2 h-4 w-4" />
              Criar Colaboração
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onJoinCollaboration} className="text-white hover:bg-gray-700">
              <Link className="mr-2 h-4 w-4" />
              Entrar em Colaboração
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAIAnalysis} className="text-white hover:bg-gray-700">
              <Brain className="mr-2 h-4 w-4" />
              Análise de IA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300">Formato:</label>
          <select 
            value={exportFormat}
            onChange={(e) => onExportFormatChange(e.target.value as 'json' | 'csv')}
            className="bg-gray-700 text-white rounded p-1"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={onExport}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center"
          >
            <Download className="mr-2" size={16} />
            Exportar
          </button>
          
          <label className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center cursor-pointer">
            <Upload className="mr-2" size={16} />
            Importar
            <input 
              type="file" 
              accept=".json,.csv"
              onChange={onImport}
              className="hidden"
            />
          </label>
          
          <button 
            onClick={onSaveClick}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg 
                     shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-colors flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Workflow
          </button>
        </div>
      </div>
    </div>
  );
};