/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITaskParam, ETaskType } from "@/types/workflow/task";
import { Node } from "@xyflow/react";

export interface IAppNodeData {
  type: ETaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface IAppNode extends Node {
  data: IAppNodeData;
}

export interface IParamProps {
  param: ITaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

export type IAppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
