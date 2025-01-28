/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Badge } from "@/components/ui/organisms/badge";
import { Button } from "@/components/ui/organisms/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { IAppNode } from "@/types/workflow/appNode";
import { ETaskType } from "@/types/workflow/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
 
 // No NodeHeader.tsx
 export const NodeHeader = ({ taskType, nodeId }: { taskType: ETaskType; nodeId: string }) => {
  // const Icon = task.icon;
  const { deleteElements, getNode, addNodes } = useReactFlow();
 
  const handleCopy = () => {
    const node = getNode(nodeId) as IAppNode;
    if (node?.measured?.height) {
      const newX = node.position.x;
      const newY = node.position.y + node.measured.height + 20;
      const newNode = CreateFlowNode(node.data.type, {
        x: newX,
        y: newY,
      });
      addNodes([newNode]);
    }
  };
 
  return (
    <div className="flex items-center gap-2 p-2">
      {/* <Icon size={16} /> */}
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {/* {task.label} */}
        </p>
        <div className="flex gap-1 items-center">
          {/* {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )} */}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
 };