// src/components/workflow/WorkflowModals/index.tsx
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from '@/services/toasts/workflowCustomizeProcessToasts';
export * from './EditNodeModal';

// src/components/workflow/WorkflowModals/EditNodeModal.tsx
import React from 'react';
import { IWorkflowNode } from '@/types/workflow/customize-process-by-workflow-types';

interface EditNodeModalProps {
  node: IWorkflowNode | null;
  onClose: () => void;
  onSave: (node: IWorkflowNode) => void;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  node,
  onClose,
  onSave
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Editar Processo
        </h2>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Título</label>
          <input 
            type="text"
            value={node.label}
            onChange={(e) => onSave({ ...node, label: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Subtítulo</label>
          <input 
            type="text"
            value={node.subtitle}
            onChange={(e) => onSave({ ...node, subtitle: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(node)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};