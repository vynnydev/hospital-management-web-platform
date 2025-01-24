/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppNode } from "@/types/workflow/appNode";
import { TaskParam, TaskType } from "@/types/workflow/task";
import { LucideProps } from "lucide-react";

export interface BaseHospitalTask extends Omit<WorkflowTask, 'type'> {
  type: TaskType.NETWORK | TaskType.HOSPITAL | TaskType.DEPARTMENT;
  execute: () => Promise<Record<string, any>>;
}

export interface BaseTask {
  execute: () => Promise<Record<string, any>>;
}
export interface NetworkTask extends WorkflowTask {
  type: TaskType.NETWORK;
}

export interface HospitalTask extends BaseHospitalTask {
  type: TaskType.HOSPITAL;
}

export interface DepartmentTask extends BaseHospitalTask {
  type: TaskType.DEPARTMENT;
}

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}
export interface WorkflowTask extends BaseTask {
  type: TaskType;
  execute: () => Promise<Record<string, any>>;
  label: string;
  icon: any;
  inputs: any[];
  outputs: any[];
  credits: number;
}

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
