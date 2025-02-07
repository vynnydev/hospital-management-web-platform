// components/staff-calendar/StaffWeekView.tsx
import React from 'react';
import { isSameDay } from 'date-fns';
import { IStaffCalendarEvent } from '@/types/staff-calendar';
import { StaffDayCell } from './StaffDayCell';

interface StaffWeekViewProps {
  weekDays: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: IStaffCalendarEvent[];
}

export const StaffWeekView: React.FC<StaffWeekViewProps> = ({
  weekDays,
  selectedDate,
  setSelectedDate,
  events = [],
}) => {
  return (
    <div className="flex-shrink-0 grid grid-cols-7 gap-2 p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
      {weekDays.map((day) => {
        const dayEvents = events.filter(event => isSameDay(event.date, day));
        const isSelectedDay = isSameDay(day, selectedDate);
        
        return (
          <StaffDayCell
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