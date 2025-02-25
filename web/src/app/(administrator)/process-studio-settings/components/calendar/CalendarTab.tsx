/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/organisms/tabs';

import { 
  CalendarFilters, 
  sampleDepartments, 
  sampleEventTypes 
} from './CalendarFilters';

import { MonthlyCalendar } from './MonthlyCalendar';
import { EventsList } from './EventsList';
import { EventForm } from './EventForm';
import { ICalendarEvent, IDepartmentSettings, IEvent } from '@/types/settings-types';
  
// Dados de amostra para eventos do calendário (visíveis nos dias)
export const sampleCalendarEvents: ICalendarEvent[] = [
    {
      id: 'event-1',
      title: 'Reunião Equipe',
      day: 6,
      type: 'meeting',
      color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
    },
    {
      id: 'event-2',
      title: 'Cirurgia 09:00',
      day: 10,
      type: 'surgery',
      color: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
    },
    {
      id: 'event-3',
      title: 'Manutenção UTI',
      day: 15,
      type: 'maintenance',
      color: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
    },
    {
      id: 'event-4',
      title: 'Treinamento',
      day: 22,
      type: 'training',
      color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200'
    }
];
  
// Dados de amostra para lista de próximos eventos
export const sampleEvents: IEvent[] = [
    {
      id: 'event-5',
      title: 'Reunião de Coordenação',
      day: 18,
      month: 'Fev',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Sala de Reuniões',
      type: 'meeting',
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'event-6',
      title: 'Cirurgia Cardíaca - Paciente 2458',
      day: 20,
      month: 'Fev',
      startTime: '08:00',
      endTime: '12:00',
      location: 'Centro Cirúrgico 3',
      type: 'surgery',
      color: 'border-red-500 bg-red-50 dark:bg-red-900/20'
    },
    {
      id: 'event-7',
      title: 'Manutenção de Equipamentos UTI',
      day: 22,
      month: 'Fev',
      startTime: '14:00',
      endTime: '16:00',
      location: 'UTI Adulto',
      type: 'maintenance',
      color: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
    }
];
  
export const CalendarTab: React.FC = () => {
  // Estados do componente
  const [currentView, setCurrentView] = useState('month');
  const [currentMonth, setCurrentMonth] = useState('Fevereiro');
  const [currentYear, setCurrentYear] = useState('2025');

  const sampleDepartments: IDepartmentSettings[] = [
    { id: 'dept-all', name: 'Todos' },
    { id: 'dept-emergency', name: 'Emergência' },
    { id: 'dept-surgery', name: 'Centro Cirúrgico' },
    { id: 'dept-icu', name: 'UTI' },
    { id: 'dept-admin', name: 'Administrativo' }
  ];
  
  // Tipos de evento de amostra para filtros
  interface EventType {
    id: string;
    name: string;
  }
  
  const sampleEventTypes: EventType[] = [
    { id: 'type-meeting', name: 'Reuniões' },
    { id: 'type-surgery', name: 'Cirurgias' },
    { id: 'type-maintenance', name: 'Manutenção' },
    { id: 'type-training', name: 'Treinamento' }
  ];

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    sampleDepartments.map(dept => dept.id) // Inicialmente todos selecionados
  );
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(
    sampleEventTypes.map(type => type.id) // Inicialmente todos selecionados
  );

  // Handlers para o calendário
  const handlePrevMonth = () => {
    // Implementar lógica para navegar para o mês anterior
    console.log('Mês anterior');
  };
  
  const handleNextMonth = () => {
    // Implementar lógica para navegar para o próximo mês
    console.log('Próximo mês');
  };
  
  const handleToday = () => {
    // Implementar lógica para voltar para o dia atual
    console.log('Hoje');
  };
  
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };
  
  const handleDayClick = (day: number) => {
    // Implementar lógica para clique em um dia
    console.log('Dia clicado:', day);
  };

  // Handlers para a lista de eventos
  const handleViewEventDetails = (eventId: string) => {
    // Implementar lógica para visualizar detalhes do evento
    console.log('Visualizar evento:', eventId);
  };
  
  // Handlers para o formulário de eventos
  const handleCreateEvent = (eventData: any) => {
    // Implementar lógica para criar novo evento
    console.log('Novo evento:', eventData);
  };

  // Handlers para os filtros
  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, departmentId]);
    } else {
      setSelectedDepartments(prev => prev.filter(id => id !== departmentId));
    }
  };
  
  const handleEventTypeChange = (typeId: string) => {
    if (selectedEventTypes.includes(typeId)) {
      setSelectedEventTypes(prev => prev.filter(id => id !== typeId));
    } else {
      setSelectedEventTypes(prev => [...prev, typeId]);
    }
  };
  
  const handleApplyFilters = () => {
    // Implementar lógica para aplicar filtros
    console.log('Filtros aplicados:', { selectedDepartments, selectedEventTypes });
  };

  return (
    <TabsContent value="calendar" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Painel de Calendário Principal */}
        <div className="lg:col-span-3">
          <MonthlyCalendar 
            month={currentMonth}
            year={currentYear}
            events={sampleCalendarEvents}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            onViewChange={handleViewChange}
            onDayClick={handleDayClick}
            currentView={currentView}
          />
          
          <EventsList 
            events={sampleEvents}
            onViewDetails={handleViewEventDetails}
          />
        </div>
        
        {/* Painel Lateral para Criação e Filtros */}
        <div className="lg:col-span-1 space-y-4">
          <EventForm onSubmit={handleCreateEvent} />
          
          <CalendarFilters 
            departments={sampleDepartments}
            eventTypes={sampleEventTypes}
            selectedDepartments={selectedDepartments}
            selectedEventTypes={selectedEventTypes}
            onDepartmentChange={handleDepartmentChange}
            onEventTypeChange={handleEventTypeChange}
            onApplyFilters={handleApplyFilters}
          />
        </div>
      </div>
    </TabsContent>
  );
};