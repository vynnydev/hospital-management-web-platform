import React from 'react';
import { isSameDay } from 'date-fns';
import { IPatientCalendarEvent } from '@/types/patient-calendar';
import { PatientDayCell } from './PatientDayCell';

interface PatientWeekViewProps {
  weekDays: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: IPatientCalendarEvent[];
}

export const PatientWeekView: React.FC<PatientWeekViewProps> = ({
  weekDays,
  selectedDate,
  setSelectedDate,
  events,
}) => {
  return (
    <div className="flex-shrink-0 grid grid-cols-7 gap-2 p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
      {weekDays.map((day) => {
        const dayEvents = events.filter(event => isSameDay(event.date, day));
        const isSelectedDay = isSameDay(day, selectedDate);
        
        return (
          <PatientDayCell
            key={day.toString()}
            day={day}
            events={dayEvents}
            isSelected={isSelectedDay}
            onClick={() => setSelectedDate(day)}
          />
        );
      })}
    </div>
  );
};