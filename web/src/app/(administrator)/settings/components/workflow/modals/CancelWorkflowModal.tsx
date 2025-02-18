import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/organisms/dialog";

interface CancelWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    workflowName: string;
  }
  
  export const CancelWorkflowModal: React.FC<CancelWorkflowModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    workflowName
  }) => {
    if (!isOpen) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Cancelar Processo</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja cancelar o processo de {workflowName}?
            </DialogDescription>
          </DialogHeader>
  
          <DialogFooter className="flex space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
            >
              Manter
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
            >
              Cancelar Processo
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  