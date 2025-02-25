import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { IEvent } from '@/types/settings-types';
  
interface IEventsListProps {
    events: IEvent[];
    onViewDetails?: (eventId: string) => void;
}
  
export const EventsList: React.FC<IEventsListProps> = ({
    events,
    onViewDetails
}) => {
    // Função para obter a cor de acordo com o tipo de evento
    const getEventColor = (type: Event['type']) => {
      switch (type) {
        case 'meeting': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        case 'surgery': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
        case 'maintenance': return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
        case 'training': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
        default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
      }
    };
  
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map(event => {
              const colorClass = getEventColor(event.type);
              
              return (
                <div key={event.id} className={`flex p-2 border-l-4 ${colorClass} rounded-r-lg`}>
                  <div className="text-center mr-4">
                    <div className="text-sm font-bold">{event.day}</div>
                    <div className="text-xs">{event.month}</div>
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.startTime} - {event.endTime} • {event.location}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onViewDetails && onViewDetails(event.id)}
                    >
                      <span className="sr-only">Editar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {events.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum evento próximo.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
};