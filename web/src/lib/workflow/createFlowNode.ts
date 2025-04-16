import { IAppNode } from "@/types/workflow/appNode";
import { ETaskType } from "@/types/workflow/task";

export function CreateFlowNode(
  nodeType: ETaskType,
  position?: { x: number; y: number }
): IAppNode {
  return {
    id: crypto.randomUUID(),
    type: "FlowScrapeNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
