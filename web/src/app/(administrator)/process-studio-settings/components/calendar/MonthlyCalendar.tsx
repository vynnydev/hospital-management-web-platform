import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { ICalendarEvent } from '@/types/settings-types';

interface MonthlyCalendarProps {
  month: string;
  year: string;
  events: ICalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewChange: (view: string) => void;
  onDayClick?: (day: number) => void;
  currentView?: string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  month,
  year,
  events,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewChange,
  onDayClick,
  currentView = 'month'
}) => {
  // Helper para obter a cor do tipo de evento
  const getEventColor = (type: ICalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200';
      case 'surgery': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200';
      case 'maintenance': return 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200';
      case 'training': return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-green-500" />
          Calendário Hospitalar
        </CardTitle>
        <CardDescription>
          Gerencie eventos, cirurgias, plantões e manutenções
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Cabeçalho de navegação do calendário */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onPrevMonth}>
              &lt;
            </Button>
            <h3 className="text-lg font-medium">{month} {year}</h3>
            <Button variant="outline" size="sm" onClick={onNextMonth}>
              &gt;
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={onToday}>
              Hoje
            </Button>
            <Select value={currentView} onValueChange={onViewChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Visualização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Dia</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Grade do calendário - Visualização Mensal */}
        <div className="border rounded-lg border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
              <div 
                key={i} 
                className="py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Grade dos dias do mês (simulação) */}
          <div className="grid grid-cols-7 grid-rows-5 h-96 bg-white dark:bg-gray-900">
            {/* Simulação simplificada de um calendário */}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3; // Supondo que o mês comece na quarta posição
              const isCurrentMonth = day > 0 && day <= 28;
              const dayEvents = events.filter(e => e.day === day);
              const isToday = day === 16; // Simulando o dia atual
              
              return (
                <div 
                  key={i}
                  className={`relative border border-gray-100 dark:border-gray-800 p-1 ${
                    isCurrentMonth 
                      ? 'bg-white dark:bg-gray-900' 
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600'
                  } ${
                    isToday ? 'ring-2 ring-inset ring-green-500 dark:ring-green-500' : ''
                  }`}
                  onClick={() => isCurrentMonth && onDayClick && onDayClick(day)}
                >
                  {isCurrentMonth && (
                    <>
                      <div className="text-xs font-medium">{day}</div>
                      
                      {/* Eventos do dia */}
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`mt-1 text-xs ${getEventColor(event.type)} rounded px-1 py-0.5 truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
