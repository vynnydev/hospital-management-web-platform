import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/organisms/dialog";
import { ISavedWorkflow } from "@/types/workflow/customize-process-by-workflow-types";

interface DeleteWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    workflow: ISavedWorkflow | null;
}
  
export const DeleteWorkflowModal: React.FC<DeleteWorkflowModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    workflow
}) => {
    if (!workflow) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Remover Workflow</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja remover o workflow `{workflow.name}`?
              Esta ação não pode ser desfeita.
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
              Remover Workflow
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};