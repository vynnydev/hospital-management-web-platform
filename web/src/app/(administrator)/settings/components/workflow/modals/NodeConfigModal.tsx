// src/components/workflow/WorkflowModals/NodeConfigModal.tsx
import React from 'react';
import { Settings2 } from 'lucide-react';
import { IWorkflowNode, TPriority } from '@/types/workflow/customize-process-by-workflow-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';

interface NodeConfigModalProps {
  node: IWorkflowNode | null;
  onClose: () => void;
  onSave: (updatedNode: IWorkflowNode) => void;
}

const priorityOptions: { value: TPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baixa', color: 'bg-green-500' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-500' },
  { value: 'high', label: 'Alta', color: 'bg-orange-500' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-500' }
];

const themeColors = [
  { name: 'Azul', value: 'blue', class: 'bg-blue-500' },
  { name: 'Verde', value: 'green', class: 'bg-green-500' },
  { name: 'Vermelho', value: 'red', class: 'bg-red-500' },
  { name: 'Roxo', value: 'purple', class: 'bg-purple-500' },
  { name: 'Laranja', value: 'orange', class: 'bg-orange-500' }
];

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  node,
  onClose,
  onSave
}) => {
  if (!node) return null;

  const handleColorChange = (color: string) => {
    onSave({ ...node, color });
  };

  const handlePriorityChange = (priority: TPriority) => {
    onSave({ ...node, priority });
  };

  return (
    <Dialog open={!!node} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-400" />
            Configurações Avançadas do Processo
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure as propriedades avançadas do processo `{node.label}`
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seleção de Prioridade */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Prioridade do Processo
            </label>
            <Select
              value={node.priority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {priorityOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-white hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Cor do Tema */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Cor do Processo
            </label>
            <div className="flex flex-wrap gap-2">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full transition-transform
                    ${color.class} ${node.color === color.value ? 'scale-110 ring-2 ring-white' : ''}
                    hover:scale-110`}
                  onClick={() => handleColorChange(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Configurações Adicionais */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Descrição do Processo
            </label>
            <textarea
              value={node.description || ''}
              onChange={(e) => onSave({ ...node, description: e.target.value })}
              placeholder="Digite uma descrição detalhada do processo..."
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white 
                       min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(node)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Salvar Configurações
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};