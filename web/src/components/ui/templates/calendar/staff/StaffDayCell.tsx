import React from 'react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/organisms/badge';
import { IStaffCalendarEvent } from '@/types/staff-calendar';

interface StaffDayCellProps {
  day: Date;
  events: IStaffCalendarEvent[];
  isSelected: boolean;
  onClick: () => void;
}

export const StaffDayCell: React.FC<StaffDayCellProps> = ({
  day,
  events = [],
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`p-4 rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30'
          : isToday(day)
          ? 'bg-blue-900/40 ring-1 ring-blue-700/50'
          : 'bg-blue-900/20 hover:bg-blue-800/30'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-300/80">
          {format(day, 'EEE', { locale: ptBR })}
        </span>
        {events.length > 0 && (
          <Badge 
            variant="outline" 
            className="bg-blue-500/10 text-blue-300 border-blue-500/20"
          >
            {events.length}
          </Badge>
        )}
      </div>
      <div className={`text-2xl font-semibold ${
        isToday(day) ? 'text-blue-400' : 'text-white'
      }`}>
        {format(day, 'd')}
      </div>
      <div className="text-xs text-blue-300/60 mt-1">
        {format(day, 'MMMM', { locale: ptBR })}
      </div>
    </div>
  );
};