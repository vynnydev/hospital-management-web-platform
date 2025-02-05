import { EventType } from '@/utils/getEventColor';

export interface IPatientCalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: EventType;
    time: string;
    participants: string[];
    description: string;
    status: 'done' | 'pending';
}