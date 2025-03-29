// Tipos para eventos do calendário e lista de eventos
export interface ICalendarEvent {
    id: string;
    title: string;
    day: number;
    type: 'meeting' | 'surgery' | 'maintenance' | 'training';
    color: string;
}
  
export interface IEvent {
    id: string;
    title: string;
    day: number;
    month: string;
    startTime: string;
    endTime?: string;
    location: string;
    type: 'meeting' | 'surgery' | 'maintenance' | 'training';
    color: string;
}

export interface IDepartmentSettings {
    id: string;
    name: string;
}
  
export interface IEventType {
    id: string;
    name: string;
}

export interface ITemplate {
    id: string;
    name: string;
    description?: string;
    category: string;
}