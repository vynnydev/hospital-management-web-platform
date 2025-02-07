import { TTaskStatus } from "@/types/staff-types";

export const getTaskStatusColor = (status: TTaskStatus) => {
    const colors = {
      pending: 'yellow',
      in_progress: 'blue',
      completed: 'green',
      delayed: 'red',
      scheduled: 'purple'
    };
    return colors[status];
};