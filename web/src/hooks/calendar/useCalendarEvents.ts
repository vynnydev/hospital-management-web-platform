import { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useStaffData } from '../staffs/useStaffData';
import api from '@/services/api';
import { ICalendarEvent, IEventType } from '@/types/calendar-types';
import { IDepartmentSettings } from '@/types/settings-types';

// Hook para gerenciar eventos do calendário
export const useCalendarEvents = (currentDate: Date) => {
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [departments, setDepartments] = useState<IDepartmentSettings[]>([]);
  const [eventTypes, setEventTypes] = useState<IEventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Obter dados de equipes e escalas
  const { staffData, getTasksAsEvents, loading: isLoadingStaff } = useStaffData();
  const staffTeams = staffData?.staffTeams;
  const staffSchedule = staffData?.staffSchedule;

  // Função para buscar eventos do mês atual
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      // 1. Buscar eventos do calendário da API
      const response = await api.get('/calendarEvents', {
        params: {
          month: format(currentDate, 'yyyy-MM'),
        }
      });
      
      const calendarEvents: ICalendarEvent[] = response.data || [];
      
      // 2. Adicionar tarefas agendadas como eventos
      const taskEvents = getTasksAsEvents();
      
      // 3. Adicionar escalas de plantão como eventos
      const shiftEvents: ICalendarEvent[] = [];
      if (staffSchedule) {
        Object.entries(staffSchedule).forEach(([hospitalId, data]) => {
          if (data && typeof data === 'object' && 'shifts' in data && Array.isArray(data.shifts)) {
            data.shifts.forEach((shift) => {
              // Filtrar apenas turnos do mês atual
              const shiftDate = parseISO(shift.date);
              const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(currentDate);
            
            if (isWithinInterval(shiftDate, { start: monthStart, end: monthEnd })) {
              shiftEvents.push({
                id: `shift-${shift.id}`,
                title: `Plantão ${shift.department} - ${shift.period}`,
                date: shift.date,
                startTime: shift.startTime,
                endTime: shift.endTime,
                department: shift.department,
                type: 'shift',
                location: hospitalId,
                attendees: shift.staff,
                status: shift.status,
                day: 0
              });
            }
          });
        }});
      }
      
      // Combinar todos os tipos de eventos
      const allEvents = [...calendarEvents, ...taskEvents, ...shiftEvents];
      
      setEvents(allEvents);
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao buscar eventos do calendário');
      console.error('Erro ao buscar eventos:', err);
      setIsLoading(false);
    }
  };

  // Função para buscar departamentos
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      
      // Se a API falhar, extrair departamentos das equipes
      if (!response.data && staffTeams) {
        const deptSet = new Set<string>();
        // Extrair departamentos únicos das equipes
        Object.values(staffTeams).forEach((teams: unknown) => {
          if (Array.isArray(teams)) {
            teams.forEach(team => {
              if (team && typeof team === 'object' && 'department' in team) {
                deptSet.add(team.department);
              }
            });
          }
        });
        
        const extractedDepts: IDepartmentSettings[] = Array.from(deptSet).map(dept => ({
          id: dept.toLowerCase().replace(/\s+/g, '-'),
          name: dept
        }));
        
        setDepartments(extractedDepts);
      } else {
        setDepartments(response.data);
      }
    } catch (err) {
      // Fallback: extrair departamentos das equipes
      if (staffTeams) {
        const deptMap = new Map<string, string>();
        // Extrair departamentos únicos
        Object.values(staffTeams).forEach((teams: unknown) => {
          if (Array.isArray(teams)) {
            teams.forEach(team => {
              if (team && typeof team === 'object' && 'department' in team) {
                deptMap.set(
                  team.department.toLowerCase().replace(/\s+/g, '-'),
                  team.department
                )};
              });
            }});

            const extractedDepts: IDepartmentSettings[] = Array.from(deptMap).map(([id, name]) => ({
              id,
              name
        }));
        
        setDepartments(extractedDepts);
      } else {
        setError('Erro ao buscar departamentos');
        console.error('Erro ao buscar departamentos:', err);
      }
    }
  };

  // Função para buscar tipos de eventos
  const fetchEventTypes = async () => {
    try {
      const response = await api.get('/eventTypes');
      if (response.data) {
        setEventTypes(response.data);
      } else {
        // Tipos padrão se a API não retornar dados
        setEventTypes([
          { id: 'meeting', name: 'Reunião', color: 'blue' },
          { id: 'surgery', name: 'Cirurgia', color: 'red' },
          { id: 'maintenance', name: 'Manutenção', color: 'amber' },
          { id: 'training', name: 'Treinamento', color: 'purple' },
          { id: 'shift', name: 'Plantão', color: 'green' },
          { id: 'procedure', name: 'Procedimento', color: 'indigo' },
          { id: 'patient_visit', name: 'Visita', color: 'emerald' },
          { id: 'other', name: 'Outro', color: 'gray' }
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos de eventos:', error);
      // Usar tipos padrão em caso de erro
      setEventTypes([
        { id: 'meeting', name: 'Reunião', color: 'blue' },
        { id: 'surgery', name: 'Cirurgia', color: 'red' },
        { id: 'maintenance', name: 'Manutenção', color: 'amber' },
        { id: 'training', name: 'Treinamento', color: 'purple' },
        { id: 'shift', name: 'Plantão', color: 'green' },
        { id: 'procedure', name: 'Procedimento', color: 'indigo' },
        { id: 'patient_visit', name: 'Visita', color: 'emerald' },
        { id: 'other', name: 'Outro', color: 'gray' }
      ]);
    }
  };

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchDepartments(),
        fetchEventTypes()
      ]);
    };
    
    fetchData();
  }, [staffTeams]);

  // Atualizar eventos quando a data ou os dados de equipes/escalas mudam
  useEffect(() => {
    if (!isLoadingStaff) {
      fetchEvents();
    }
  }, [currentDate, staffTeams, staffSchedule, isLoadingStaff]);

  // Adicionar novo evento
  const addEvent = async (eventData: Partial<ICalendarEvent>) => {
    try {
      // Gerar ID temporário para preview
      const tempId = `temp-${Date.now()}`;
      const newEvent: ICalendarEvent = {
        id: tempId,
        title: eventData.title || 'Novo Evento',
        date: eventData.date || format(new Date(), 'yyyy-MM-dd'),
        startTime: eventData.startTime || '08:00',
        endTime: eventData.endTime,
        department: eventData.department || 'geral',
        type: eventData.type || 'other',
        location: eventData.location,
        description: eventData.description,
        attendees: eventData.attendees || [],
        status: 'confirmed',
        day: 0
      };
      
      // Adicionar ao estado para feedback imediato
      setEvents(prev => [...prev, newEvent]);
      
      // Enviar para API
      const response = await api.post('/calendarEvents', newEvent);
      
      // Atualizar com ID real da API
      setEvents(prev => prev.map(event => 
        event.id === tempId ? { ...event, id: response.data.id } : event
      ));
      
      return response.data;
    } catch (err) {
      setError('Erro ao adicionar evento');
      console.error('Erro ao adicionar evento:', err);
    }
  };

  // Atualizar evento existente
  const updateEvent = async (eventId: string, eventData: Partial<ICalendarEvent>) => {
    try {
      // Atualizar localmente para feedback imediato
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, ...eventData } : event
      ));
      
      // Enviar para API
      await api.put(`/calendarEvents/${eventId}`, eventData);
    } catch (err) {
      setError('Erro ao atualizar evento');
      console.error('Erro ao atualizar evento:', err);
      
      // Reverter mudanças em caso de erro
      fetchEvents();
    }
  };

  // Remover evento
  const removeEvent = async (eventId: string) => {
    try {
      // Remover localmente para feedback imediato
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
      // Enviar para API
      await api.delete(`/calendarEvents/${eventId}`);
    } catch (err) {
      setError('Erro ao remover evento');
      console.error('Erro ao remover evento:', err);
      
      // Reverter mudanças em caso de erro
      fetchEvents();
    }
  };

  // Obter um evento específico pelo ID
  const getEvent = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  return {
    events,
    departments,
    eventTypes,
    isLoading,
    error,
    addEvent,
    updateEvent,
    removeEvent,
    getEvent,
    refreshEvents: fetchEvents
  };
};