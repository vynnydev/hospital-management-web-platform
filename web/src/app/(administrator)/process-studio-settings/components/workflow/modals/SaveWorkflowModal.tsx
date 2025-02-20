import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/organisms/dialog";
import { Save } from "lucide-react";

// src/components/workflow/modals/SaveWorkflowModal.tsx
interface SaveWorkflowModalProps {
    isOpen: boolean;
    onSave: (name: string, description: string) => void;
    onClose: () => void;
    afterSaveWorkflow: () => void;
  }
  
  export const SaveWorkflowModal: React.FC<SaveWorkflowModalProps> = ({
    isOpen,
    onSave,
    onClose,
    afterSaveWorkflow,
  }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSave = () => {
      onSave(name, description);
      afterSaveWorkflow();
      setName('');
      setDescription('');
      onClose();
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-100 dark:bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Salvar Workflow</DialogTitle>
            <DialogDescription className="text-gray-400">
              Dê um nome e uma descrição para seu workflow
            </DialogDescription>
          </DialogHeader>
  
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nome do Workflow</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded text-white"
                placeholder="Ex: Workflow de Atendimento Emergencial"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Descrição</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded text-white h-24 resize-none"
                placeholder="Descreva o propósito deste workflow..."
              />
            </div>
          </div>
  
          <DialogFooter>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancelar
            </button>
            <button 
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg 
                            hover:from-blue-700 hover:to-cyan-600 transition-colors"
                >
                <Save className="mr-2 h-4 w-4" />
                Salvar Workflow
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};