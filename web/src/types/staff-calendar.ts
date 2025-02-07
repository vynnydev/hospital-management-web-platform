// types/staff-calendar.ts
import type { TTaskType, TTaskStatus, TTaskPriority } from './staff-types';

export interface IStaffCalendarEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    type: TTaskType;
    status: TTaskStatus;
    priority: TTaskPriority;
    assignedTo: string;
    participants?: string[];
    duration: number;
}