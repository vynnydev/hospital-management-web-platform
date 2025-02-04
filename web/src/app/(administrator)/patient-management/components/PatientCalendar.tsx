/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isToday, parseISO, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from "react-day-picker";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  UserPlus,
  UserMinus,
  Stethoscope,
  ClipboardCheck,
  Pill,
  ArrowRightLeft,
  Activity,
  Clock,
  Users,
  CalendarDays,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Badge } from '@/components/ui/organisms/badge';
import { Calendar } from '@/components/ui/organisms/calendar';
import { IPatient } from '@/types/hospital-network-types';

interface IPatientCalendarProps {
    /** Lista de todos os pacientes disponíveis */
    patients: IPatient[];
    
    /** Informações do usuário logado */
    currentUser: {
      name: string;
      role?: string;
      id?: string;
    } | null;
    
    /** Paciente atualmente selecionado */
    selectedPatient: IPatient | null;
    
    /** Função chamada quando um paciente é selecionado */
    onSelectPatient: (patient: IPatient) => void;
}

const HOUR_HEIGHT = 80; // Aumentado para dar mais espaço aos eventos
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const PatientCalendar: React.FC<IPatientCalendarProps> = ({
  patients,
  currentUser,
  selectedPatient,
  onSelectPatient,
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  
    // Efeito para selecionar automaticamente o primeiro paciente
    useEffect(() => {
      if (patients.length > 0 && !selectedPatient) {
        onSelectPatient(patients[0]);
        if (patients[0].admissionDate) {
          setSelectedDate(parseISO(patients[0].admissionDate));
        }
      }
    }, [patients, selectedPatient, onSelectPatient]);
  
    const weekDays = useMemo(() => {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [selectedDate]);
  
    const patientEvents = useMemo(() => {
      if (!selectedPatient) return [];
      
      const events = [];
      
      // Adiciona evento de admissão
      if (selectedPatient.admissionDate) {
        events.push({
          id: 'admission',
          title: 'Admissão Hospitalar',
          date: parseISO(selectedPatient.admissionDate),
          type: 'admission',
          time: format(parseISO(selectedPatient.admissionDate), 'HH:mm'),
          participants: [selectedPatient.name],
          description: `Admissão do paciente ${selectedPatient.name} para ${selectedPatient.diagnosis}`,
          status: 'done'
        });
      }
  
      // Adiciona evento de alta prevista
      if (selectedPatient.expectedDischarge) {
        events.push({
          id: 'discharge',
          title: 'Alta Prevista',
          date: parseISO(selectedPatient.expectedDischarge),
          type: 'discharge',
          time: format(parseISO(selectedPatient.expectedDischarge), 'HH:mm'),
          participants: [selectedPatient.name],
          description: 'Alta hospitalar prevista',
          status: 'pending'
        });
      }
  
      // Adiciona eventos do histórico de cuidados
      selectedPatient.careHistory?.events?.forEach(event => {
        events.push({
          id: event.id,
          title: event.description,
          date: parseISO(event.timestamp),
          type: event.type,
          time: format(parseISO(event.timestamp), 'HH:mm'),
          participants: [selectedPatient.name, event.responsibleStaff.name],
          description: event.description,
          status: event.type === 'procedure' ? 'pending' : 'done'
        });
      });
  
      return events;
    }, [selectedPatient]);
  
    const getEventColor = (type: string, variant: 'bg' | 'border' | 'text' = 'bg') => {
      const colors = {
        admission: {
          bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
          border: 'border-emerald-500',
          text: 'text-emerald-100'
        },
        discharge: {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          border: 'border-blue-500',
          text: 'text-blue-100'
        },
        procedure: {
          bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
          border: 'border-purple-500',
          text: 'text-purple-100'
        },
        exam: {
          bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
          border: 'border-amber-500',
          text: 'text-amber-100'
        },
        medication: {
          bg: 'bg-gradient-to-r from-rose-500 to-rose-600',
          border: 'border-rose-500',
          text: 'text-rose-100'
        },
        transfer: {
          bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
          border: 'border-cyan-500',
          text: 'text-cyan-100'
        }
      };
  
      return colors[type as keyof typeof colors]?.[variant] || 
             (variant === 'bg' ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 
              variant === 'text' ? 'text-gray-100' : 'border-gray-500');
    };
  
    const getEventIcon = (type: string) => {
      const icons = {
        admission: <UserPlus className="w-4 h-4" />,
        discharge: <UserMinus className="w-4 h-4" />,
        procedure: <Stethoscope className="w-4 h-4" />,
        exam: <ClipboardCheck className="w-4 h-4" />,
        medication: <Pill className="w-4 h-4" />,
        transfer: <ArrowRightLeft className="w-4 h-4" />
      };
  
      return icons[type as keyof typeof icons] || <Activity className="w-4 h-4" />;
    };
  
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
  
    const renderEventCard = (event: any) => (
      <div
        key={event.id}
        className={`absolute left-1 right-1 p-4 rounded-lg shadow-lg hover:shadow-xl 
                    transition-all duration-300 hover:scale-105 ${getEventColor(event.type)} 
                    border-l-4 ${getEventColor(event.type, 'border')}`}
        style={{
          top: `${(parseInt(event.time.split(':')[0]) + 
                parseInt(event.time.split(':')[1]) / 60) * HOUR_HEIGHT}px`,
          minHeight: '120px',
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
          {event.status && (
            <Badge 
              variant="outline" 
              className={`${
                event.status === 'done' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}
            >
              {event.status === 'done' ? 'Concluído' : 'Pendente'}
            </Badge>
          )}
        </div>
  
        {/* Conteúdo do Card */}
        <div className="space-y-3">
          <h4 className="font-medium text-white text-sm">
            {event.title}
          </h4>
  
          <p className="text-white/70 text-xs line-clamp-2">
            {event.description}
          </p>
  
          {/* Participantes */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex -space-x-2">
              {event.participants.map((participant: string, index: number) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 
                           flex items-center justify-center text-[10px] text-white font-medium
                           border-2 border-white/20"
                  title={participant}
                >
                  {participant.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  
    return (
      <div className="flex h-[100vh] bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl">
        {/* Sidebar */}
        <div className="w-80 flex flex-col bg-gradient-to-b from-blue-900/50 to-cyan-900/50 border-r border-blue-800/30">
          {/* Cabeçalho da Sidebar */}
          <div className="p-4 border-b border-blue-800/30">
            <h2 className="text-lg font-semibold text-white">
              Pacientes
            </h2>
            <p className="text-sm text-blue-300/80">
              {patients.length} pacientes no departamento
            </p>
          </div>
  
          {/* Lista de Pacientes com Scroll Suave */}
          <div className='h-36'>
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      selectedPatient?.id === patient.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-blue-500'
                        : 'hover:bg-blue-800/30'
                    }`}
                    onClick={() => onSelectPatient(patient)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                      bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-medium`}>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {patient.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-blue-300/80">Alta prevista:</span>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                            {format(parseISO(patient.expectedDischarge), 'dd/MM/yyyy')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Lista de Eventos */}
          <div className="flex-shrink-0 p-4 border-t border-blue-800/30 bg-gradient-to-b from-blue-900/30 to-cyan-900/30">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Eventos do Paciente</h3>
              <p className="text-sm text-blue-300/80">
                {patientEvents.length} eventos programados
              </p>
            </div>
            <ScrollArea className="h-52">
              <div className="space-y-3">
                {patientEvents
                  .sort((a, b) => {
                    const timeA = parseInt(a.time.split(':').join(''));
                    const timeB = parseInt(b.time.split(':').join(''));
                    return timeA - timeB;
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedDate(event.date);
                        
                        setTimeout(() => {
                          const eventHour = parseInt(event.time.split(':')[0]);
                          const eventMinutes = parseInt(event.time.split(':')[1]);
                          const scrollPosition = (eventHour + eventMinutes / 60) * HOUR_HEIGHT;
                          
                          const scrollContainer = document.querySelector('.flex-1.overflow-auto');
                          if (scrollContainer) {
                            scrollContainer.scrollTo({
                              top: scrollPosition - 100, // -100 para mostrar contexto acima
                              behavior: 'smooth'
                            });
                          }
                        }, 100);
                      }}
                      className={`p-3 rounded-lg bg-gradient-to-br from-slate-800/80 to-slate-900/80 
                                border-l-4 ${getEventColor(event.type, 'border')} hover:from-slate-800 
                                hover:to-slate-900 transition-all duration-200 cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <Badge variant="outline" className={`${getEventColor(event.type)} border-0`}>
                              <span className="capitalize">{event.type}</span>
                            </Badge>
                            <div className="flex flex-col gap-1 text-white/80 mt-1">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {format(event.date, 'dd/MM/yyyy', { locale: ptBR })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs font-medium">{event.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
  
          {/* Mini Calendário Melhorado */}
          <div className="flex-shrink-0 p-4 border-t border-blue-800/30 bg-gradient-to-b from-blue-900/30 to-cyan-900/30">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-white">
                {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
              </span>
            </div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              showOutsideDays={false}
              className="rounded-lg border border-blue-800/30 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center text-blue-100 font-medium",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-blue-300/80 hover:text-white",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-around",
                head_cell: "text-blue-300/80 font-normal text-center rounded-md w-9 font-medium text-[0.8rem]",
                row: "flex w-full mt-2 justify-around",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal text-blue-100 hover:bg-blue-800/50 focus:bg-blue-800/50 rounded-md aria-selected:opacity-100",
                day_selected: "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:bg-blue-500 focus:bg-blue-500 focus:text-white",
                day_today: "bg-blue-800/50 text-white font-semibold",
                day_outside: "text-slate-500 opacity-50",
                day_disabled: "text-slate-500 opacity-50",
                day_range_middle: "aria-selected:bg-blue-500/20 aria-selected:text-slate-900",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
              }}
            />
          </div>
        </div>
  
        {/* Área Principal */}
        <div className="flex-1 flex flex-col">
          {/* Cabeçalho */}
          <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-blue-800/30 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
            <div>
              <h1 className="text-xl font-semibold text-white">
                Olá, {currentUser?.name || 'Usuário'}
              </h1>
              <p className="text-sm text-blue-300/80">
                Gerencie os eventos dos pacientes
              </p>
            </div>
  
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-y-auto bg-blue-900/20">
                <Button
                  variant={view === 'day' ? 'default' : 'outline'}
                  size="sm"
                  className={view === 'day' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-0' : 'border-blue-800/30 text-blue-300/80 hover:text-white'}
                  onClick={() => setView('day')}
                >
                  Dia
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  className={view === 'week' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-0' : 'border-blue-800/30 text-blue-300/80 hover:text-white'}
                  onClick={() => setView('week')}
                >
                  Semana
                </Button>
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  className={view === 'month' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-0' : 'border-blue-800/30 text-blue-300/80 hover:text-white'}
                  onClick={() => setView('month')}
                >
                  Mês
                </Button>
              </div>
  
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-blue-800/30 text-blue-300/80 hover:text-white"
                  onClick={() => setSelectedDate(new Date())}
                >
                  <CalendarIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-blue-800/30 text-blue-300/80 hover:text-white"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 7);
                    setSelectedDate(newDate);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-blue-800/30 text-blue-300/80 hover:text-white"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 7);
                    setSelectedDate(newDate);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>
  
          {/* Área do Calendário */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Grade de Dias da Semana */}
            <div className="flex-shrink-0 grid grid-cols-7 gap-2 p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
              {weekDays.map((day) => {
                const dayEvents = patientEvents.filter(event => isSameDay(event.date, day));
                const isSelectedDay = isSameDay(day, selectedDate);
                
                return (
                  <div
                    key={day.toString()}
                    className={`p-4 rounded-xl transition-all duration-200 ${
                      isSelectedDay
                        ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30'
                        : isToday(day)
                        ? 'bg-blue-900/40 ring-1 ring-blue-700/50'
                        : 'bg-blue-900/20 hover:bg-blue-800/30'
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-300/80">
                        {format(day, 'EEE', { locale: ptBR })}
                      </span>
                      {dayEvents.length > 0 && (
                        <Badge 
                          variant="outline" 
                          className="bg-blue-500/10 text-blue-300 border-blue-500/20"
                        >
                          {dayEvents.length}
                        </Badge>
                      )}
                    </div>
                    <div className={`text-2xl font-semibold ${
                      isToday(day) ? 'text-blue-400' : 'text-white'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="text-xs text-blue-300/60 mt-1">
                      {format(day, 'MMMM', { locale: ptBR })}
                    </div>
                  </div>
                );
              })}
            </div>
  
            {/* Grade de Tempo com Eventos */}
            <div className="flex-1 overflow-auto">
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
                  {!selectedPatient ? (
                    <div className="absolute inset-0 col-span-7">
                      {renderNoPatientSelected()}
                    </div>
                  ) : (
                    <>
                      {/* Linhas horizontais */}
                      <div className="absolute inset-0 col-span-7">
                        {HOURS.map((hour) => (
                          <div
                            key={hour}
                            className="border-t border-slate-700/30 h-20"
                            style={{ top: `${hour * 80}px` }}
                          />
                        ))}
                      </div>
  
                      {/* Colunas dos dias com eventos */}
                      {weekDays.map((day) => (
                        <div key={day.toString()} className="relative" style={{ minHeight: `${24 * 80}px` }}>
                          {patientEvents
                            .filter((event) => isSameDay(event.date, day))
                            .sort((a, b) => {
                              const timeA = parseInt(a.time.split(':').join(''));
                              const timeB = parseInt(b.time.split(':').join(''));
                              return timeA - timeB;
                            })
                            .map((event, index, array) => {
                              const prevEvent = array[index - 1];
                              const prevEventEndTime = prevEvent ? 
                                parseInt(prevEvent.time.split(':')[0]) * 80 + 100 : -1;
                              const currentEventTime = parseInt(event.time.split(':')[0]) * 80;
                              
                              // Ajusta a posição se houver sobreposição
                              const adjustedTop = prevEventEndTime >= currentEventTime ? 
                                prevEventEndTime + 20 : currentEventTime;
  
                              return (
                                <div
                                  key={event.id}
                                  data-event-id={event.id}
                                  className={`absolute left-1 right-1 p-4 rounded-lg shadow-lg 
                                              hover:shadow-xl transition-all duration-300 hover:scale-105 
                                              ${getEventColor(event.type)} border-l-4 
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
                                    <div className="pt-2 border-t border-white/10">
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
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};