import React from 'react';
import { ViewSelector } from './ViewSelector';
import { DateNavigator } from './DateNavigator';

interface CalendarHeaderProps {
  currentUser: { name: string; role?: string; id?: string; } | null;
  view: 'day' | 'week' | 'month';
  setView: (view: 'day' | 'week' | 'month') => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentUser,
  view,
  setView,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-blue-800/30 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-tr-xl">
      <div>
        <h1 className="text-xl font-semibold text-white">
          Olá, {currentUser?.name || 'Usuário'}
        </h1>
        <p className="text-sm text-blue-300/80">
          Gerencie os eventos dos pacientes
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ViewSelector view={view} setView={setView} />
        <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
    </header>
  );
};