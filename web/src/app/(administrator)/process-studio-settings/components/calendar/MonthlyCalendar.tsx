import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  format,
  isSameDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/organisms/tooltip';
import { Badge } from '@/components/ui/organisms/badge';

interface ICalendarEvent {
  id: string;
  title: string;
  day: number;
  type: string;
  priority?: string;
  status?: string;
}

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
  // Calcular os dias a serem exibidos no calendário
  const calendarDays = useMemo(() => {
    const currentDate = new Date(`${month} 1, ${year}`);
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo = 0
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [month, year]);

  // Helper para obter a cor do tipo de evento
  const getEventColor = (type: ICalendarEvent['type'], priority?: string, status?: string) => {
    // Prioridade sobrescreve o tipo em casos de alta prioridade
    if (priority === 'high') {
      return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300';
    }
    
    // Status pendente ou cancelado
    if (status === 'cancelled') {
      return 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 border-gray-300 line-through';
    }
    
    // Cores por tipo de evento
    switch (type) {
      case 'meeting': 
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-300';
      case 'surgery': 
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300';
      case 'maintenance': 
        return 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300';
      case 'training': 
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-300';
      case 'shift': 
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300';
      case 'procedure': 
        return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-300';
      case 'patient_visit': 
        return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-300';
      default: 
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-300';
    }
  };

  // Agrupar eventos por dia
  const eventsByDay = useMemo(() => {
    const eventMap: Record<number, ICalendarEvent[]> = {};
    
    events.forEach(event => {
      if (!eventMap[event.day]) {
        eventMap[event.day] = [];
      }
      eventMap[event.day].push(event);
    });
    
    return eventMap;
  }, [events]);

  // Ordenar eventos por prioridade
  const sortEventsByPriority = (events: ICalendarEvent[]) => {
    return [...events].sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        high: 0,
        medium: 1,
        low: 2,
        undefined: 3
      };
      
      return (priorityOrder[a.priority || 'undefined'] || 3) - (priorityOrder[b.priority || 'undefined'] || 3);
    });
  };

  // Verificar se é o dia atual
  const isToday = (day: Date) => {
    return isSameDay(day, new Date());
  };

  // Renderizar cada evento no dia
  const renderEvents = (day: number, maxToShow = 3) => {
    const dayEvents = eventsByDay[day] || [];
    const sortedEvents = sortEventsByPriority(dayEvents);
    const visibleEvents = sortedEvents.slice(0, maxToShow);
    const hiddenCount = Math.max(0, dayEvents.length - maxToShow);
    
    return (
      <>
        {visibleEvents.map(event => (
          <div 
            key={event.id}
            className={`text-xs px-1 py-0.5 rounded border truncate ${getEventColor(event.type, event.priority, event.status)}`}
          >
            {event.title}
          </div>
        ))}
        
        {hiddenCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 cursor-pointer">
                  + {hiddenCount} mais
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 max-w-xs">
                  {sortedEvents.slice(maxToShow).map(event => (
                    <div key={event.id} className="text-sm">
                      {event.title}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </>
    );
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-green-500" />
            Calendário Hospitalar
          </CardTitle>
          <CardDescription className="hidden sm:block">
            Gerencie eventos, cirurgias, plantões e manutenções
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-4">
        {/* Cabeçalho de navegação do calendário */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-0 border-b sm:border-0 border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onPrevMonth} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Mês anterior</span>
            </Button>
            <h3 className="text-lg font-medium">{month} {year}</h3>
            <Button variant="outline" size="sm" onClick={onNextMonth} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próximo mês</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={onToday}>
              Hoje
            </Button>
            <Select value={currentView} onValueChange={onViewChange}>
              <SelectTrigger className="w-32 h-8">
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
        <div className="border rounded-lg border-gray-200 dark:border-gray-700 overflow-hidden mt-4">
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
          
          {/* Grade dos dias do mês */}
          <div className="grid grid-cols-7 auto-rows-fr bg-white dark:bg-gray-900 divide-x divide-y divide-gray-200 dark:divide-gray-700">
            {calendarDays.map((day, i) => {
              const dayNumber = day.getDate();
              const isCurrentMonth = isSameMonth(day, new Date(`${month} 1, ${year}`));
              const isTodayDate = isToday(day);
              
              return (
                <div 
                  key={i}
                  className={`relative min-h-20 p-1 ${
                    isCurrentMonth 
                      ? 'bg-white dark:bg-gray-900' 
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600'
                  } ${
                    isTodayDate ? 'ring-2 ring-inset ring-green-500 dark:ring-green-500' : ''
                  } hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors`}
                  onClick={() => isCurrentMonth && onDayClick && onDayClick(dayNumber)}
                >
                  {/* Número do dia */}
                  <div className={`text-sm font-medium ${
                    isTodayDate 
                      ? 'bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center' 
                      : ''
                  }`}>
                    {dayNumber}
                  </div>
                  
                  {/* Eventos do dia */}
                  {isCurrentMonth && (
                    <div className="mt-1 space-y-1">
                      {renderEvents(dayNumber)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 border-blue-300">Reunião</Badge>
          <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 border-red-300">Cirurgia</Badge>
          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 border-amber-300">Manutenção</Badge>
          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 border-purple-300">Treinamento</Badge>
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 border-green-300">Plantão</Badge>
          <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300">Procedimento</Badge>
        </div>
      </CardContent>
    </Card>
  );
};