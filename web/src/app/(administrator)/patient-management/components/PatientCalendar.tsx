import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isToday, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/organisms/avatar';
import { Button } from '@/components/ui/organisms/button';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Badge } from '@/components/ui/organisms/badge';
import type { IPatient } from '@/types/hospital-network-types';

interface PatientCalendarProps {
  patients: IPatient[];
  currentUser: { name: string } | null;
  selectedPatient: IPatient | null;
  onSelectPatient: (patient: IPatient) => void;
}

const HOUR_HEIGHT = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const PatientCalendar: React.FC<PatientCalendarProps> = ({
  patients,
  currentUser,
  selectedPatient,
  onSelectPatient,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const patientEvents = useMemo(() => {
    if (!selectedPatient) return [];
    
    const events = [];
    
    // Adiciona evento de admissão
    events.push({
      id: 'admission',
      title: 'Admissão Hospitalar',
      date: parseISO(selectedPatient.admissionDate),
      type: 'admission',
      time: format(parseISO(selectedPatient.admissionDate), 'HH:mm'),
    });

    // Adiciona evento de alta prevista
    events.push({
      id: 'discharge',
      title: 'Alta Prevista',
      date: parseISO(selectedPatient.expectedDischarge),
      type: 'discharge',
      time: format(parseISO(selectedPatient.expectedDischarge), 'HH:mm'),
    });

    // Adiciona eventos do histórico de cuidados
    selectedPatient.careHistory?.events.forEach(event => {
      events.push({
        id: event.id,
        title: event.description,
        date: parseISO(event.timestamp),
        type: event.type,
        time: format(parseISO(event.timestamp), 'HH:mm'),
      });
    });

    return events;
  }, [selectedPatient]);

  const renderTimeGrid = () => (
    <div className="relative grid grid-cols-[auto,1fr] gap-4">
      <div className="sticky left-0 z-10 w-16 bg-white dark:bg-gray-800">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="flex items-center justify-end pr-4 h-16 text-sm text-gray-500 dark:text-gray-400"
          >
            {`${String(hour).padStart(2, '0')}:00`}
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {weekDays.map((day) => (
          <div key={day.toString()} className="relative">
            {patientEvents
              .filter((event) => isSameDay(event.date, day))
              .map((event) => (
                <div
                  key={event.id}
                  className="absolute left-1 right-1 p-2 rounded-lg text-sm"
                  style={{
                    top: `${(parseInt(event.time.split(':')[0]) + 
                          parseInt(event.time.split(':')[1]) / 60) * HOUR_HEIGHT}px`,
                    backgroundColor: getEventColor(event.type),
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={getEventVariant(event.type)}>
                      {event.type}
                    </Badge>
                    <span className="font-medium text-white">{event.title}</span>
                  </div>
                  <span className="text-xs text-white/90">{event.time}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );

  const getEventColor = (type: string) => {
    switch (type) {
      case 'admission': return 'bg-green-500';
      case 'discharge': return 'bg-blue-500';
      case 'procedure': return 'bg-purple-500';
      case 'exam': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'admission': return 'secondary';
      case 'discharge': return 'default';
      case 'procedure': return 'secondary';
      case 'exam': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-gray-800 rounded-xl">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pacientes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {patients.length} pacientes no departamento
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedPatient?.id === patient.id
                  ? 'bg-primary/10 dark:bg-primary/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={patient.photo} alt={patient.name} />
                  <AvatarFallback>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Alta prevista: {format(parseISO(patient.expectedDischarge), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Olá, {currentUser?.name || 'Usuário'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gerencie os eventos dos pacientes
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex rounded-lg overflow-hidden">
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                onClick={() => setView('day')}
              >
                Dia
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                onClick={() => setView('week')}
              >
                Semana
              </Button>
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                onClick={() => setView('month')}
              >
                Mês
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDate(new Date())}
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
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

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 dark:border-gray-700">
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className={`p-2 font-medium ${
                  isToday(day)
                    ? 'text-primary'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <div className="text-sm">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className="text-lg">
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {renderTimeGrid()}
        </div>
      </div>
    </div>
  );
};