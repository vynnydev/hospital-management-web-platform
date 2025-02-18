import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ISavedWorkflow } from '@/types/workflow/customize-process-by-workflow-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';

interface AuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: ISavedWorkflow | null;
  onAuthorize: () => void;
  onDeny: () => void;
}

export const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  isOpen,
  onClose,
  workflow,
  onAuthorize,
  onDeny
}) => {
  if (!workflow || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            Autorização de Acesso
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Você está prestes a visualizar o workflow `{workflow.name}`
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-300">
            Este workflow contém {workflow.nodes.length} processos e foi criado em{' '}
            {new Date(workflow.createdAt).toLocaleDateString()}.
          </p>
          <p className="mt-2 text-sm text-gray-300">
            Ao autorizar, você poderá:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-400">
            <li>• Visualizar toda a estrutura do workflow</li>
            <li>• Fazer alterações nos processos existentes</li>
            <li>• Adicionar novos processos ao workflow</li>
          </ul>
        </div>

        <DialogFooter className="flex space-x-2">
          <button
            onClick={onDeny}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onAuthorize}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Autorizar Acesso
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};