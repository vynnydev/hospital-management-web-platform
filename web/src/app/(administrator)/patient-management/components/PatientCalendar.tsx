import React, { useState, useEffect, useMemo } from 'react';
import { startOfWeek, addDays, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { IPatient } from '@/types/hospital-network-types';

// Components
import { PatientsList } from '@/components/ui/templates/calendar/patient/PatientsList';
import { PatientEventsList } from '@/components/ui/templates/calendar/patient/PatientEventsList';
import { CalendarHeader } from '@/components/ui/templates/calendar/CalendarHeader';
import { PatientWeekView } from '@/components/ui/templates/calendar/patient/PatientWeekView';
import { PatientTimeGrid } from '@/components/ui/templates/calendar/patient/PatientTimeGrid';
import { MiniCalendar } from '@/components/ui/templates/calendar/MiniCalendar';

// Hooks
import { usePatientEvents } from '@/hooks/patients/usePatientEvents';
import { IPatientCalendarEvent } from '@/types/patient-calendar';

interface PatientCalendarProps {
  patients: IPatient[];
  currentUser: {
    name: string;
    role?: string;
    id?: string;
  } | null;
  selectedPatient: IPatient | null;
  onSelectPatient: (patient: IPatient) => void;
}

export const PatientCalendar: React.FC<PatientCalendarProps> = ({
  patients,
  currentUser,
  selectedPatient,
  onSelectPatient,
}) => {
  // Estados
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  // Hooks personalizados
  const events = usePatientEvents(selectedPatient);

  // Memo para dias da semana
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  // Effect para seleção inicial de paciente
  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      onSelectPatient(patients[0]);
      if (patients[0].admissionDate) {
        setSelectedDate(parseISO(patients[0].admissionDate));
      }
    }
  }, [patients, selectedPatient, onSelectPatient]);

  // Handler para clique em evento
  const handleEventClick = (event: IPatientCalendarEvent) => {
    setSelectedDate(event.date);
    scrollToEvent(event);
  };

  // Função para scroll até o evento
  const scrollToEvent = (event: IPatientCalendarEvent) => {
    setTimeout(() => {
      const eventHour = parseInt(event.time.split(':')[0]);
      const eventMinutes = parseInt(event.time.split(':')[1]);
      const scrollPosition = (eventHour + eventMinutes / 60) * 80;
      
      const scrollContainer = document.querySelector('.flex-1.overflow-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollPosition - 100,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Renderiza mensagem quando nenhum paciente está selecionado
  const renderNoPatientSelected = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm">
      <div className="p-8 rounded-3xl bg-slate-800/60 shadow-xl border border-slate-700/50 max-w-lg text-center space-y-6">
        <div className="inline-flex p-6 rounded-full bg-slate-700/50 ring-4 ring-slate-600/30">
          <CalendarDays className="w-12 h-12 text-slate-300 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-white">
            Selecione um Paciente
          </h3>
          <p className="text-slate-300">
            Escolha um paciente na lista ao lado para visualizar seus eventos e consultas no calendário
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100vh] bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl">
      {/* Sidebar */}
      <div className="w-80 flex flex-col bg-gradient-to-b from-blue-900/50 to-cyan-900/50 border-r border-blue-800/30 rounded-tl-xl">
        {/* Cabeçalho da Sidebar */}
        <div className="p-4 border-b border-blue-800/30">
          <h2 className="text-lg font-semibold text-white">
            Pacientes
          </h2>
          <p className="text-sm text-blue-300/80">
            {patients.length} pacientes no departamento
          </p>
        </div>

        {/* Lista de Pacientes */}
        <PatientsList
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={onSelectPatient}
        />

        {/* Lista de Eventos */}
        <div className="flex-shrink-0 p-4 border-t border-blue-800/30 bg-gradient-to-b from-blue-900/30 to-cyan-900/30">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Eventos do Paciente</h3>
            <p className="text-sm text-blue-300/80">
              {events.length} eventos programados
            </p>
          </div>
          <PatientEventsList events={events} onEventClick={handleEventClick} />
        </div>

        {/* Mini Calendário */}
        <MiniCalendar 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}        
        />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col">
        {/* Cabeçalho */}
        <CalendarHeader
          currentUser={currentUser}
          view={view}
          setView={setView}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarContext={'pacientes'}
        />

        {/* Área do Calendário */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Grid de Dias da Semana */}
          <PatientWeekView
            weekDays={weekDays}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            events={events}
          />

          {/* Grid de Tempo com Eventos */}
          {selectedPatient ? (
            <div className="flex-1 overflow-auto">
              <PatientTimeGrid
                weekDays={weekDays}
                events={events}
                hourHeight={80}
              />
            </div>
          ) : (
            renderNoPatientSelected()
          )}
        </div>
      </div>
    </div>
  );
};