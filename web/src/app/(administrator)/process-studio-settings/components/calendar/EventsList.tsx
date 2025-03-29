import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { 
  Edit, 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown 
} from 'lucide-react';
import { Badge } from '@/components/ui/organisms/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Switch } from '@/components/ui/organisms/switch';
import { Label } from '@/components/ui/organisms/label';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface IEvent {
  id: string;
  title: string;
  date?: string;
  day: string;
  month: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  department?: string;
  priority?: string;
  status?: string;
  description?: string;
}

interface IEventsListProps {
  events: IEvent[];
  onViewDetails?: (eventId: string) => void;
  onAddEvent?: () => void;
  title?: string;
  showAddButton?: boolean;
  isLoading?: boolean;
}

export const EventsList: React.FC<IEventsListProps> = ({
  events,
  onViewDetails,
  onAddEvent,
  title = "Próximos Eventos",
  showAddButton = false,
  isLoading = false
}) => {
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [filterHighPriority, setFilterHighPriority] = useState<boolean>(false);
  const [filterToday, setFilterToday] = useState<boolean>(false);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  // Função para obter a cor de acordo com o tipo de evento
  const getEventColor = (type: string, priority?: string) => {
    // Prioridade sobrescreve o tipo se for alta
    if (priority === 'high') {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }
    
    switch (type) {
      case 'meeting': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'surgery': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'maintenance': return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'training': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'shift': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'procedure': return 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
      case 'patient_visit': return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  // Função para obter badge com base no status
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Confirmado</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Em andamento</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Agendado</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Pendente</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Cancelado</Badge>;
      default:
        return null;
    }
  };

  // Verificar se um evento é hoje
  const isEventToday = (event: IEvent) => {
    if (!event.date) return false;
    return isToday(parseISO(event.date));
  };

  // Verificar se um evento é futuro
  const isEventFuture = (event: IEvent) => {
    if (!event.date) return false;
    return isFuture(parseISO(event.date));
  };

  // Alternar evento expandido
  const toggleExpandEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    
    setExpandedEvents(newExpanded);
  };

  // Formatar o prazo do evento
  const formatEventDeadline = (date?: string) => {
    if (!date) return '';
    
    const eventDate = parseISO(date);
    
    if (isToday(eventDate)) {
      return 'Hoje';
    }
    
    return format(eventDate, "dd 'de' MMMM", { locale: ptBR });
  };

  // Eventos filtrados e ordenados
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];
    
    // Aplicar filtros
    if (filterHighPriority) {
      filtered = filtered.filter(event => event.priority === 'high');
    }
    
    if (filterToday) {
      filtered = filtered.filter(event => event.date && isToday(parseISO(event.date)));
    }
    
    // Aplicar ordenação
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'date':
          valueA = a.date ? parseISO(a.date).getTime() : 0;
          valueB = b.date ? parseISO(b.date).getTime() : 0;
          break;
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
          valueA = priorityOrder[a.priority as keyof typeof priorityOrder] || 3;
          valueB = priorityOrder[b.priority as keyof typeof priorityOrder] || 3;
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'type':
          valueA = a.type.toLowerCase();
          valueB = b.type.toLowerCase();
          break;
        default:
          valueA = a.date ? parseISO(a.date).getTime() : 0;
          valueB = b.date ? parseISO(b.date).getTime() : 0;
      }
      
      return sortOrder === 'asc' 
        ? (valueA > valueB ? 1 : -1) 
        : (valueA < valueB ? 1 : -1);
    });
    
    return filtered;
  }, [events, sortBy, sortOrder, filterHighPriority, filterToday]);

  // Alternar a direção da ordenação
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            {title}
          </CardTitle>
          
          {showAddButton && onAddEvent && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddEvent}
              className="h-8"
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Novo
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {/* Controles de ordenação e filtro */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="priority">Prioridade</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="type">Tipo</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSortOrder}
              className="h-8 w-8 p-0"
            >
              {sortOrder === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">
                {sortOrder === 'asc' ? 'Ordenação Crescente' : 'Ordenação Decrescente'}
              </span>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Switch 
                id="today-filter" 
                checked={filterToday}
                onCheckedChange={setFilterToday}
              />
              <Label htmlFor="today-filter" className="text-xs">Hoje</Label>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Switch 
                id="priority-filter" 
                checked={filterHighPriority}
                onCheckedChange={setFilterHighPriority}
              />
              <Label htmlFor="priority-filter" className="text-xs">Prioridade Alta</Label>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Switch 
                id="details-toggle" 
                checked={showDetails}
                onCheckedChange={setShowDetails}
              />
              <Label htmlFor="details-toggle" className="text-xs">Detalhes</Label>
            </div>
          </div>
        </div>
        
        {/* Lista de eventos */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map(event => {
              const colorClass = getEventColor(event.type, event.priority);
              const isExpanded = expandedEvents.has(event.id);
              const isToday = isEventToday(event);
              
              return (
                <div 
                  key={event.id} 
                  className={`flex flex-col p-3 border-l-4 ${colorClass} rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer`}
                  onClick={() => onViewDetails && onViewDetails(event.id)}
                >
                  <div className="flex items-start">
                    <div className="text-center mr-4 w-12">
                      <div className={`text-sm font-bold ${isToday ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {event.day}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {event.month}
                      </div>
                      {isToday && (
                        <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px] px-1">
                          Hoje
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {event.title}
                        </h4>
                        
                        {!showDetails && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 ml-2"
                            onClick={(e) => toggleExpandEvent(event.id, e)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                            <span className="sr-only">Expandir</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-2 mt-1">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.startTime} - {event.endTime}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                        
                        {event.status && getStatusBadge(event.status)}
                        
                        {event.priority === 'high' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Prioridade Alta</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-auto flex items-center pl-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails && onViewDetails(event.id);
                        }}
                      >
                        <span className="sr-only">Editar</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Detalhes extras do evento - Exibidos se showDetails=true ou se o evento estiver expandido */}
                  {(showDetails || isExpanded) && event.description && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                      <p>{event.description}</p>
                      
                      {event.department && (
                        <div className="mt-1 flex items-center">
                          <span className="font-medium mr-1">Departamento:</span>
                          {event.department}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>Nenhum evento encontrado.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {filteredAndSortedEvents.length > 0 && (
        <CardFooter className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'evento' : 'eventos'} encontrados
          </div>
          
          {onAddEvent && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddEvent}
              className="h-8"
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Adicionar Evento
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};