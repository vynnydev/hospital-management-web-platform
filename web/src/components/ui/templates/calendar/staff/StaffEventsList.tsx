// components/staff-calendar/StaffEventsList.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Badge } from '@/components/ui/organisms/badge';
import { Clock, Users } from 'lucide-react';
import { IStaffCalendarEvent } from '@/types/staff-calendar';

interface StaffEventsListProps {
  events: IStaffCalendarEvent[];
  onEventClick: (event: IStaffCalendarEvent) => void;
}

export const StaffEventsList: React.FC<StaffEventsListProps> = ({
  events,
  onEventClick,
}) => {
  return (
    <ScrollArea className="h-52">
      <div className="space-y-3 p-4">
        {events
          .sort((a, b) => {
            const timeA = parseInt(a.time.split(':').join(''));
            const timeB = parseInt(b.time.split(':').join(''));
            return timeA - timeB;
          })
          .map((event) => (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className="w-full p-3 rounded-lg bg-blue-900 border-l-4 border-blue-500
                      hover:bg-blue-800 active:bg-blue-700
                      transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant="outline" 
                  className="bg-blue-500/10 text-blue-300 border-blue-500/20"
                >
                  {event.type}
                </Badge>
                <span className="text-sm text-blue-300">{event.time}</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-1 truncate">
                {event.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-blue-300/80">
                <Users className="w-3 h-3" />
                <span className="truncate">Responsável: {event.assignedTo}</span>
              </div>
            </button>
          ))}
      </div>
    </ScrollArea>
  );
};