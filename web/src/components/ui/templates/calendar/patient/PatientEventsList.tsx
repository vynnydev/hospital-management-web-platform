import React from 'react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Badge } from '@/components/ui/organisms/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { getEventColor } from '@/utils/getEventColor';
import { getEventIcon } from '@/utils/getEventIcon';
import { IPatientCalendarEvent } from '@/types/patient-calendar';

interface PatientEventsListProps {
  events: IPatientCalendarEvent[];
  onEventClick: (event: IPatientCalendarEvent) => void;
}

export const PatientEventsList: React.FC<PatientEventsListProps> = ({
  events,
  onEventClick,
}) => {
  return (
    <ScrollArea className="h-52">
      <div className="space-y-3">
        {events
          .sort((a, b) => {
            const timeA = parseInt(a.time.split(':').join(''));
            const timeB = parseInt(b.time.split(':').join(''));
            return timeA - timeB;
          })
          .map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`p-3 rounded-lg bg-gradient-to-br from-slate-800/80 to-slate-900/80 
                        border-l-4 ${getEventColor(event.type, 'border')} hover:from-slate-800 
                        hover:to-slate-900 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type, 'bg')}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`${getEventColor(event.type, 'bg')} border-0`}
                    >
                      <span className={`capitalize ${getEventColor(event.type, 'text')}`}>
                        {event.type}
                      </span>
                    </Badge>
                    <div className="flex flex-col gap-1 text-white/80 mt-1">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {format(event.date, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/90 line-clamp-2">
                {event.description}
              </p>
            </div>
          ))}
      </div>
    </ScrollArea>
  );
};