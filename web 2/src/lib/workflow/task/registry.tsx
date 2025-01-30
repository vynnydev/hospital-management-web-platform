/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, Hospital, Boxes } from 'lucide-react';

import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson";
import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook";
import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import { FillInputTask } from "@/lib/workflow/task/FillInput";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { NavigateUrlTask } from "@/lib/workflow/task/NavigateUrlTask";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/ReadPropertyFromJson";
import { ScrollToElementTask } from "@/lib/workflow/task/ScrollToElement";
import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";
import { TaskType } from "@/types/workflow/task";
import { DepartmentTask, HospitalTask, NetworkTask } from "@/types/workflow/workflow";

type HospitalTasks = {
  [TaskType.NETWORK]: NetworkTask;
  [TaskType.HOSPITAL]: HospitalTask;
  [TaskType.DEPARTMENT]: DepartmentTask;
}

type ExistingTasks = {
  [TaskType.LAUNCH_BROWSER]: typeof LaunchBrowserTask;
  [TaskType.PAGE_TO_HTML]: typeof PageToHtmlTask;
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: typeof ExtractTextFromElementTask;
  [TaskType.FILL_INPUT]: typeof FillInputTask;
  [TaskType.CLICK_ELEMENT]: typeof ClickElementTask;
  [TaskType.WAIT_FOR_ELEMENT]: typeof WaitForElementTask;
  [TaskType.DELIVER_VIA_WEBHOOK]: typeof DeliverViaWebhookTask;
  [TaskType.EXTRACT_DATA_WITH_AI]: typeof ExtractDataWithAITask;
  [TaskType.READ_PROPERTY_FROM_JSON]: typeof ReadPropertyFromJsonTask;
  [TaskType.ADD_PROPERTY_TO_JSON]: typeof AddPropertyToJsonTask;
  [TaskType.NAVIGATE_URL]: typeof NavigateUrlTask;
  [TaskType.SCROLL_TO_ELEMENT]: typeof ScrollToElementTask;
 };

type Registry = HospitalTasks & ExistingTasks;

export const TaskRegistry: Registry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserTask,
  [TaskType.PAGE_TO_HTML]: PageToHtmlTask,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementTask,
  [TaskType.FILL_INPUT]: FillInputTask,
  [TaskType.CLICK_ELEMENT]: ClickElementTask,
  [TaskType.WAIT_FOR_ELEMENT]: WaitForElementTask,
  [TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookTask,
  [TaskType.EXTRACT_DATA_WITH_AI]: ExtractDataWithAITask,
  [TaskType.READ_PROPERTY_FROM_JSON]: ReadPropertyFromJsonTask,
  [TaskType.ADD_PROPERTY_TO_JSON]: AddPropertyToJsonTask,
  [TaskType.NAVIGATE_URL]: NavigateUrlTask,
  [TaskType.SCROLL_TO_ELEMENT]: ScrollToElementTask,
  [TaskType.NETWORK]: {
    type: TaskType.NETWORK,
    label: 'Rede Hospitalar',
    icon: Building2,
    inputs: [],
    outputs: [],
    execute: async (): Promise<Record<string, any>> => ({}),
    credits: 1
  } satisfies NetworkTask,
  
  [TaskType.HOSPITAL]: {
    type: TaskType.HOSPITAL,
    label: 'Hospital',
    icon: Hospital,
    inputs: [],
    outputs: [],
    execute: async (): Promise<Record<string, any>> => ({}),
    credits: 1
  } satisfies HospitalTask,
  
  [TaskType.DEPARTMENT]: {
    type: TaskType.DEPARTMENT,
    label: 'Departamento',
    icon: Boxes,
    inputs: [],
    outputs: [],
    execute: async (): Promise<Record<string, any>> => ({}),
    credits: 1
  } satisfies DepartmentTask
};
