/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { MonthlyCalendar } from './MonthlyCalendar';
import { EventsList, IEvent } from './EventsList';
import { EventForm } from './EventForm';
import { CalendarFilters } from './CalendarFilters';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useStaffData } from '@/hooks/staffs/useStaffData';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { ICalendarEvent } from '@/types/calendar-types';

export const HospitalaryCalendarModule: React.FC = () => {
  // Estado para gerenciar data atual
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<string>('month');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Estados para filtros
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  // Hooks personalizados para buscar dados
  const staffDataResult = useStaffData();
  const staffTeams = staffDataResult.staffData?.staffTeams;
  const staffSchedule = staffDataResult.staffData?.staffSchedule;
  const isLoadingStaff = staffDataResult.loading;

  const { 
    events, 
    addEvent, 
    updateEvent, 
    departments, 
    eventTypes, 
    isLoading: isLoadingEvents
  } = useCalendarEvents(currentDate);

  // Formatar mês e ano para exibição
  const month = format(currentDate, 'MMMM', { locale: ptBR });
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
  const year = format(currentDate, 'yyyy');

  // Determinar quais eventos devem ser exibidos com base nos filtros
  const filteredEvents = events.filter(event => {
    const departmentMatch = selectedDepartments.length === 0 || 
      selectedDepartments.includes(event.department);
    const typeMatch = selectedEventTypes.length === 0 || 
      selectedEventTypes.includes(event.type);
    return departmentMatch && typeMatch;
  });

  // Eventos do mês formatados para o calendário
  const calendarEvents: ICalendarEvent[] = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    day: parseInt(format(parseISO(event.date), 'd')),
    type: event.type,
    date: event.date,
    startTime: event.startTime,
    department: event.department
  }));

  // Próximos eventos para a lista lateral
  const upcomingEvents: IEvent[] = filteredEvents
    .filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate >= new Date();
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      title: event.title,
      day: format(parseISO(event.date), 'dd'),
      month: format(parseISO(event.date), 'MMM', { locale: ptBR }),
      startTime: event.startTime,
      endTime: event.endTime || '',
      location: event.location || '',
      type: event.type
    }));

  // Callbacks para navegação no calendário
  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Manipuladores para filtros
  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, departmentId]);
    } else {
      setSelectedDepartments(prev => prev.filter(id => id !== departmentId));
    }
  };

  const handleEventTypeChange = (typeId: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleApplyFilters = () => {
    // Lógica adicional se necessário ao aplicar filtros
  };

  // Manipuladores para eventos
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowNewEventForm(true);
  };

  const handleNewEvent = () => {
    setShowNewEventForm(true);
  };

  const handleSubmitEvent = (eventData: any) => {
    if (selectedEventId) {
      updateEvent(selectedEventId, eventData);
      setSelectedEventId(null);
    } else {
      addEvent(eventData);
    }
    setShowNewEventForm(false);
  };

  const handleViewEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowNewEventForm(true);
  };

  // Inicializar filtros com todos os departamentos
  useEffect(() => {
    if (departments.length > 0 && selectedDepartments.length === 0) {
      setSelectedDepartments(departments.map(dept => dept.id));
    }
  }, [departments, selectedDepartments.length]);

  // Carregar dados de agendamentos em staffSchedule para o calendário
  useEffect(() => {
    if (staffSchedule) {
      // Transformar staffSchedule em eventos de calendário
      // Implementação depende da estrutura exata do staffSchedule
      // Esta é uma lógica simplificada
      const scheduleEvents = Object.entries(staffSchedule).flatMap(([hospitalId, data]) => {
        return data.shifts.map(shift => ({
          id: shift.id,
          title: `Plantão ${shift.department} - ${shift.period}`,
          date: shift.date,
          startTime: shift.startTime,
          endTime: shift.endTime,
          department: shift.department,
          type: 'shift',
          location: hospitalId
        }));
      });
      
      // Adicionar à lista de eventos (Isso seria feito dentro do hook useCalendarEvents)
      // addScheduleEvents(scheduleEvents);
    }
  }, [staffSchedule]);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Cabeçalho */}
      <div className="col-span-12 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          Calendário Hospitalar
        </h2>
        <button 
          onClick={handleNewEvent}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Evento
        </button>
      </div>
      
      {/* Calendário e Detalhes */}
      <div className="col-span-12 md:col-span-8">
        <MonthlyCalendar
          month={monthCapitalized}
          year={year}
          events={calendarEvents}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onViewChange={setCurrentView}
          onDayClick={handleDayClick}
          currentView={currentView}
        />
      </div>
      
      {/* Painel Lateral */}
      <div className="col-span-12 md:col-span-4">
        <div className="space-y-4">
          {showNewEventForm ? (
            <EventForm 
              onSubmit={handleSubmitEvent} 
              eventId={selectedEventId}
            />
          ) : (
            <>
              <CalendarFilters
                departments={departments}
                eventTypes={eventTypes}
                selectedDepartments={selectedDepartments}
                selectedEventTypes={selectedEventTypes}
                onDepartmentChange={handleDepartmentChange}
                onEventTypeChange={handleEventTypeChange}
                onApplyFilters={handleApplyFilters}
              />
              <EventsList 
                events={upcomingEvents} 
                onViewDetails={handleViewEventDetails} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};