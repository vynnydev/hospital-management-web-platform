// src/components/workflow/WorkflowModals/CollaborationInviteModal.tsx
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';

interface CollaborationInviteModalProps {
  onClose: () => void;
  onJoin: (inviteCode: string) => void;
}

export const CollaborationInviteModal: React.FC<CollaborationInviteModalProps> = ({
  onClose,
  onJoin
}) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = () => {
    onJoin(inviteCode);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Colaboração em Workflow
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Entre em um workflow colaborativo usando um código de convite
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="block text-sm text-gray-400 mb-2">
            Código de Convite
          </label>
          <input 
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Digite o código de convite"
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        </div>

        <DialogFooter className="flex space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!inviteCode.trim()}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white 
                     disabled:bg-blue-600/50 disabled:cursor-not-allowed"
          >
            Entrar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};