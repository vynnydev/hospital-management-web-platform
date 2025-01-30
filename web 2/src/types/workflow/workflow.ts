/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAppNode } from "@/types/workflow/appNode";
import { ITaskParam, ETaskType } from "@/types/workflow/task";
import { LucideProps } from "lucide-react";

export enum IWorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}
export interface IWorkflowTask extends IBaseTask {
  type: ETaskType;
  execute: () => Promise<Record<string, any>>;
  label: string;
  icon: any;
  inputs: any[];
  outputs: any[];
  credits: number;
}

export type IWorkflowExecutionPlanPhase = {
  phase: number;
  nodes: IAppNode[];
};

export interface IBaseHospitalTask extends Omit<IWorkflowTask, 'type'> {
  type: ETaskType.NETWORK | ETaskType.HOSPITAL | ETaskType.DEPARTMENT;
  execute: () => Promise<Record<string, any>>;
}

export interface IBaseTask {
  execute: () => Promise<Record<string, any>>;
}
export interface INetworkTask extends IWorkflowTask {
  type: ETaskType.NETWORK;
}

export interface IHospitalTask extends IBaseHospitalTask {
  type: ETaskType.HOSPITAL;
}

export interface IDepartmentTask extends IBaseHospitalTask {
  type: ETaskType.DEPARTMENT;
}


export type TWorkflowExecutionPlan = IWorkflowExecutionPlanPhase[];

export enum EWorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum EWorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

export enum EExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
