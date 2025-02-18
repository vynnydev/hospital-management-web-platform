import { IWorkflowNode } from "@/types/workflow/customize-process-by-workflow-types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useDragHandlers = (
    setDraggingNode: (node: any | null) => void,
    setWorkflow: (nodes: IWorkflowNode[] | ((prev: IWorkflowNode[]) => IWorkflowNode[])) => void
  ) => {
    const startDragging = (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setDraggingNode({
        node,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      });
    };
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      setDraggingNode((dragging: any) => {
        if (!dragging) return null;
  
        const containerRect = e.currentTarget.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragging.offsetX;
        const newY = e.clientY - containerRect.top - dragging.offsetY;
  
        setWorkflow(prev => prev.map(node => 
          node.id === dragging.node.id 
            ? {...node, x: newX, y: newY} 
            : node
        ));
  
        return dragging;
      });
    };
  
    const stopDragging = () => {
      setDraggingNode(null);
    };
  
    return {
      startDragging,
      handleMouseMove,
      stopDragging
    };
  };