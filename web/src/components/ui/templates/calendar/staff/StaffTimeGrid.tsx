// components/staff-calendar/StaffTimeGrid.tsx
import React from 'react';
import { isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/organisms/badge';
import { Clock, Users } from 'lucide-react';
import { IStaffCalendarEvent } from '@/types/staff-calendar';

interface StaffTimeGridProps {
    weekDays: Date[];
    events: IStaffCalendarEvent[];
    hourHeight?: number;
    onEventClick?: (event: IStaffCalendarEvent) => void;
}

export const StaffTimeGrid: React.FC<StaffTimeGridProps> = ({
    weekDays,
    events = [],
    hourHeight = 80,
    onEventClick
}) => {
    const HOURS = Array.from({ length: 24 }, (_, i) => i);
  
    const getEventPosition = (event: IStaffCalendarEvent) => {
        try {
        const [hours, minutes] = event.time.split(':').map(Number);
        return hours * hourHeight + (minutes / 60) * hourHeight;
        } catch (error) {
        console.error('Error calculating event position:', error, event);
        return 0;
        }
    };

    console.log('TimeGrid rendering with events:', events);

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
            <div className="absolute inset-0">
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
                .map((event) => (
                <div
                    key={event.id}
                    className="absolute left-1 right-1 p-4 rounded-lg shadow-lg 
                                bg-blue-900 border-l-4 border-blue-500 
                                hover:shadow-xl transition-all duration-300 
                                overflow-hidden cursor-pointer  
                                hover:bg-blue-800 active:bg-blue-700"  // Adicionei estas classes
                    style={{
                        top: `${getEventPosition(event)}px`,
                        minHeight: '100px',
                        zIndex: 10
                    }}
                    onClick={() => onEventClick?.(event)}
                >
                <div className="flex items-center justify-between mb-2">
                    <Badge 
                    variant="outline" 
                    className="bg-blue-500/10 text-blue-300 border-blue-500/20 truncate max-w-[120px]"
                    >
                    {event.type}
                    </Badge>
                    <Badge 
                    variant="outline" 
                    className="bg-blue-500/10 text-blue-300 border-blue-500/20"
                    >
                    {event.priority}
                    </Badge>
                </div>
                
                <h4 className="font-medium text-white text-sm mb-1 truncate">
                    {event.title}
                </h4>
                
                <div className="flex items-center gap-2 text-xs text-white/70">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                    <span className="text-white/50">({event.duration}min)</span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-xs text-white/70 truncate">
                    <Users className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Responsável: {event.assignedTo}</span>
                </div>
                </div>
                ))}
            </div>
            ))}
        </div>
        </div>
    );
};