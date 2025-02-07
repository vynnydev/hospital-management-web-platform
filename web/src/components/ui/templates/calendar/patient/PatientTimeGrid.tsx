import React from 'react';
import { isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/organisms/badge';
import { getEventColor } from '@/utils/getEventColor';
import { getEventIcon } from '@/utils/getEventIcon';
import { Clock, Users } from 'lucide-react';
import { IPatientCalendarEvent } from '@/types/patient-calendar';

interface PatientTimeGridProps {
  weekDays: Date[];
  events: IPatientCalendarEvent[];
  hourHeight?: number;
}

export const PatientTimeGrid: React.FC<PatientTimeGridProps> = ({
  weekDays,
  events,
  hourHeight = 80 // Altura padrão para cada hora
}) => {
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventPosition = (event: IPatientCalendarEvent) => {
    const [hours, minutes] = event.time.split(':').map(Number);
    return hours * hourHeight + (minutes / 60) * hourHeight;
  };

  return (
    <div className="relative grid grid-cols-[auto,1fr] gap-4">
      {/* Coluna de horários */}
      <div className="sticky left-0 z-10 w-20 bg-gradient-to-r from-slate-900 to-slate-900/80">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="flex items-center justify-end pr-4 h-20 text-sm text-slate-400"
          >
            {`${String(hour).padStart(2, '0')}:00`}
          </div>
        ))}
      </div>

      {/* Grid com eventos */}
      <div className="relative grid grid-cols-7 gap-px bg-slate-800/50">
        {/* Linhas horizontais */}
        <div className="absolute inset-0 col-span-7">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="border-t border-slate-700/30 h-20"
              style={{ top: `${hour * hourHeight}px` }}
            />
          ))}
        </div>

        {/* Colunas dos dias com eventos */}
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className="relative" 
            style={{ minHeight: `${24 * hourHeight}px` }}
          >
            {events
              .filter((event) => isSameDay(event.date, day))
              .sort((a, b) => {
                const timeA = parseInt(a.time.split(':').join(''));
                const timeB = parseInt(b.time.split(':').join(''));
                return timeA - timeB;
              })
              .map((event, index, array) => {
                const prevEvent = array[index - 1];
                const prevEventEndTime = prevEvent ? 
                  getEventPosition(prevEvent) + 100 : -1;
                const currentEventTime = getEventPosition(event);
                
                // Ajusta a posição se houver sobreposição
                const adjustedTop = prevEventEndTime >= currentEventTime ? 
                  prevEventEndTime + 20 : currentEventTime;

                return (
                  <div
                    key={event.id}
                    data-event-id={event.id}
                    className={`absolute left-1 right-1 p-4 rounded-lg shadow-lg 
                              hover:shadow-xl transition-all duration-300 hover:scale-105 
                              ${getEventColor(event.type, 'bg')} border-l-4 
                              ${getEventColor(event.type, 'border')}`}
                    style={{
                      top: `${adjustedTop}px`,
                      minHeight: '100px',
                      zIndex: 10
                    }}
                  >
                    {/* Cabeçalho do Card */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-white/10">
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-white/10 text-white border-0">
                            <span className="capitalize">{event.type}</span>
                          </Badge>
                          <div className="flex items-center gap-1 text-white/80 mt-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-medium">{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-white text-sm">
                        {event.title}
                      </h4>

                      <p className="text-white/70 text-xs line-clamp-2">
                        {event.description}
                      </p>

                      {/* Tags dos Participantes */}
                      {event.participants && event.participants.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-3 h-3 text-white/70" />
                            <span className="text-xs text-white/70">Participantes:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {event.participants.map((participant, index) => (
                              <Badge 
                                key={index}
                                variant="outline" 
                                className="bg-white/10 text-white border-white/20"
                              >
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};