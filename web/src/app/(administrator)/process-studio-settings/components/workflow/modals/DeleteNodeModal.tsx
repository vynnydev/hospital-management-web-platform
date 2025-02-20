import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/organisms/dialog";
import { IWorkflowNode } from "@/types/workflow/customize-process-by-workflow-types";

interface DeleteNodeModalProps {
    node: IWorkflowNode | null;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  export const DeleteNodeModal: React.FC<DeleteNodeModalProps> = ({
    node,
    onClose,
    onConfirm
  }) => {
    if (!node) return null;
  
    return (
      <Dialog open={!!node} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o processo `{node.label}`? 
              Todos os processos filhos também serão removidos.
            </DialogDescription>
          </DialogHeader>
  
          <DialogFooter className="flex space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
            >
              Excluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };