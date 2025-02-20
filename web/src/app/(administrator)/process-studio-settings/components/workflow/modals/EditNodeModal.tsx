import React, { useEffect, useState } from 'react';
import { IWorkflowNode } from '@/types/workflow/customize-process-by-workflow-types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';

export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from './EditNodeModal';

// src/components/workflow/WorkflowModals/EditNodeModal.tsx

interface EditNodeModalProps {
  node: IWorkflowNode | null;
  onClose: () => void;
  onSave: (updatedNode: IWorkflowNode) => void;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  node,
  onClose,
  onSave
}) => {
  // Estados locais para controlar os valores dos campos
  const [editedNode, setEditedNode] = useState<IWorkflowNode | null>(null);

  // Atualiza o estado local quando o nó muda
  useEffect(() => {
    if (node) {
      setEditedNode({ ...node });
    }
  }, [node]);

  if (!node || !editedNode) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Previne a propagação do evento
    const { name, value } = e.target;
    setEditedNode(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne a propagação do evento
    if (editedNode) {
      onSave(editedNode);
    }
  };

  return (
    <Dialog open={!!node} onOpenChange={onClose}>
      <DialogContent 
        className="bg-gray-800 text-white"
        onClick={(e) => e.stopPropagation()} // Previne propagação no container
      >
        <DialogHeader>
          <DialogTitle>Editar Processo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Título</label>
            <input 
              type="text"
              name="label"
              value={editedNode.label}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()} // Previne propagação no input
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Subtítulo</label>
            <input 
              type="text"
              name="subtitle"
              value={editedNode.subtitle || ''}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()} // Previne propagação no input
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};