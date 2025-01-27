import { TaskParamType } from "@/types/workflow/task";

export const ColorForHandle: Record<TaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400",
  SELECT: "!bg-rose-400",
  CREDENTIAL: "!bg-teal-400",
  [TaskParamType.ARRAY]: "",
  [TaskParamType.NUMBER]: ""
};
