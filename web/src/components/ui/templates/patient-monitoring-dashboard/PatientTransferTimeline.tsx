import React from 'react';
import { 
  CalendarClock, 
  ArrowRightCircle, 
  Stethoscope, 
  Pill, 
  ClipboardList, 
  Activity,
  Workflow,
  ArrowUpRight,
  Building2,
  User,
} from 'lucide-react';
import { IPatientCareHistory, IStatusHistory, ICareEvent } from '@/types/hospital-network-types';
import { Card, CardContent } from '../../organisms/card';
import { Badge } from '../../organisms/badge';

interface PatientTransferTimelineProps {
  careHistory: IPatientCareHistory;
}

// Interface para os itens da linha do tempo (combinando eventos e status)
interface TimelineItem {
  type: 'event' | 'status';
  timestamp: string;
  data: ICareEvent | IStatusHistory;
}

// Helper to format date
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// Helper to get icon for event type
const getEventIcon = (type: string) => {
  switch (type) {
    case 'admission':
      return <ArrowRightCircle className="h-5 w-5 text-green-500 dark:text-green-400" />;
    case 'transfer':
      return <Workflow className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    case 'procedure':
      return <Stethoscope className="h-5 w-5 text-violet-500 dark:text-violet-400" />;
    case 'medication':
      return <Pill className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
    case 'exam':
      return <ClipboardList className="h-5 w-5 text-teal-500 dark:text-teal-400" />;
    case 'discharge':
      return <ArrowUpRight className="h-5 w-5 text-green-500 dark:text-green-400" />;
    default:
      return <CalendarClock className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
  }
};

// Helper to get color for event type
const getEventColor = (type: string): string => {
  switch (type) {
    case 'admission':
      return 'border-l-green-500 dark:border-l-green-600';
    case 'transfer':
      return 'border-l-blue-500 dark:border-l-blue-600';
    case 'procedure':
      return 'border-l-violet-500 dark:border-l-violet-600';
    case 'medication':
      return 'border-l-amber-500 dark:border-l-amber-600';
    case 'exam':
      return 'border-l-teal-500 dark:border-l-teal-600';
    case 'discharge':
      return 'border-l-green-500 dark:border-l-green-600';
    default:
      return 'border-l-gray-300 dark:border-l-gray-700';
  }
};

// Helper to get status badge variant
const getStatusBadgeVariant = (status: string): string => {
  if (status.includes('Aguardando')) 
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
  if (status.includes('Em Procedimento')) 
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800';
  if (status.includes('Em Recuperação')) 
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800';
  if (status.includes('Em Atendimento')) 
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800';
  if (status.includes('Alta')) 
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
};

export const PatientTransferTimeline: React.FC<PatientTransferTimelineProps> = ({ careHistory }) => {
  // Combine events and status history for a complete timeline
  const timelineItems: TimelineItem[] = [
    ...careHistory.events.map(event => ({
      type: 'event' as const,
      timestamp: event.timestamp,
      data: event
    })),
    ...careHistory.statusHistory.map(status => ({
      type: 'status' as const,
      timestamp: status.timestamp,
      data: status
    }))
  ].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); // Sort descending
  });

  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Histórico de Atendimento
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ID de Admissão: {careHistory.admissionId} • 
            Iniciado em: {formatDateTime(careHistory.startDate)}
          </p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800">
            <CalendarClock className="h-3 w-3 mr-1" />
            Tempo Total: {careHistory.totalLOS} dias
          </Badge>
          <Badge className={
            careHistory.status === 'active' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800' 
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800'
          }>
            {careHistory.status === 'active' ? 'Em Atendimento' : 
             careHistory.status === 'discharged' ? 'Alta' : 'Transferido'}
          </Badge>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="space-y-0">
            {timelineItems.map((item, index) => (
              <div 
                key={`${item.type}-${index}`} 
                className={`relative pl-8 pr-4 py-4 border-l-2 ${
                  item.type === 'event' ? getEventColor((item.data as ICareEvent).type) : 'border-l-gray-300 dark:border-l-gray-700'
                } ${
                  index !== timelineItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                } hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors`}
              >
                <div className="absolute left-0 top-4 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-0.5 rounded-full">
                  {item.type === 'event' ? 
                    getEventIcon((item.data as ICareEvent).type) : 
                    <CalendarClock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  }
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {item.type === 'event' 
                        ? (item.data as ICareEvent).description 
                        : `Status alterado para ${(item.data as IStatusHistory).status}`}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        {formatDateTime(item.timestamp)}
                      </span>
                      
                      <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800 flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {item.data.department}
                      </Badge>
                      
                      {item.type === 'event' && (item.data as ICareEvent).details && (
                        Object.entries((item.data as ICareEvent).details || {}).map(([key, value]) => (
                          value && (
                            <Badge 
                              key={key} 
                              className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800"
                            >
                              {key}: {value}
                            </Badge>
                          )
                        ))
                      )}
                      
                      {item.type === 'status' && (
                        <Badge className={getStatusBadgeVariant((item.data as IStatusHistory).status)}>
                          {(item.data as IStatusHistory).status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {item.type === 'event' 
                      ? (item.data as ICareEvent).responsibleStaff.name
                      : (item.data as IStatusHistory).updatedBy.name}
                  </div>
                </div>
              </div>
            ))}
            
            {timelineItems.length === 0 && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                Nenhum registro de evento disponível para este paciente.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};