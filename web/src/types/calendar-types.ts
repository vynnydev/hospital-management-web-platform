// Tipos para eventos do calendário e lista de eventos
export interface ICalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  department: string;
  type: string;
  location?: string;
  description?: string;
  attendees?: string[];
  notification?: number; // minutos antes
  isRecurring?: boolean;
  recurrencePattern?: string;
  createdBy?: string;
  status?: string;
}

export interface IEventType {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}