import React, { useState, useEffect, useMemo } from 'react';
import { startOfWeek, addDays, parseISO, format, isSameDay, isValid } from 'date-fns';
import { CalendarDays, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Badge } from '@/components/ui/organisms/badge';

// Tipos
import type { IStaffTeam, IStaffTask } from '@/types/staff-types';
import { IStaffCalendarEvent } from '@/types/staff-calendar';

// Components
import { CalendarHeader } from '@/components/ui/templates/calendar/CalendarHeader';
import { StaffWeekView } from '@/components/ui/templates/calendar/staff/StaffWeekView';
import { StaffTimeGrid } from '@/components/ui/templates/calendar/staff/StaffTimeGrid';
import { MiniCalendar } from '@/components/ui/templates/calendar/MiniCalendar';
import { StaffEventsList } from '@/components/ui/templates/calendar/staff/StaffEventsList';

interface StaffCalendarProps {
    teams: IStaffTeam[];
    currentUser: {
      name: string;
      role?: string;
      id?: string;
    } | null;
    selectedTeam: IStaffTeam | null;
    onSelectTeam: (team: IStaffTeam) => void;
    onTaskUpdate?: (task: IStaffTask) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
    teams,
    currentUser,
    selectedTeam,
    onSelectTeam,
    onTaskUpdate
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week' | 'month'>('week');
    
    // Função para scroll até o horário específico
    const scrollToTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const position = hours * 80 + (minutes / 60) * 80;
        
        const timeGridContainer = document.querySelector('.time-grid-container');
        if (timeGridContainer) {
            timeGridContainer.scrollTo({
                top: Math.max(0, position - 50),
                behavior: 'smooth'
            });
        }
    };

    // Handler para clique nos eventos
    const handleEventClick = (event: IStaffCalendarEvent) => {
        setSelectedDate(event.date);
        
        // Pequeno delay para garantir que a mudança de data foi processada
        setTimeout(() => {
            scrollToTime(event.time);
        }, 100);

        if (onTaskUpdate) {
            const task = selectedTeam?.tasks.find(t => t.id === event.id);
            if (task) {
                onTaskUpdate(task);
            }
        }
    };
    
    // Conversão de tasks para eventos
    const allEvents = useMemo(() => {
        if (!selectedTeam?.tasks?.length) return [];
        
        return selectedTeam.tasks
            .map(task => {
                try {
                    if (!task.scheduledFor) return null;
                    
                    const scheduledDate = parseISO(task.scheduledFor);
                    if (!isValid(scheduledDate)) return null;

                    const event: IStaffCalendarEvent = {
                        id: task.id,
                        title: task.title,
                        description: task.description || '',
                        date: scheduledDate,
                        time: format(scheduledDate, 'HH:mm'),
                        type: task.type,
                        status: task.status,
                        priority: task.priority,
                        assignedTo: task.assignedTo,
                        participants: task.patientId ? [`Paciente: ${task.patientId}`] : undefined,  // Pode ser undefined
                        duration: task.estimatedDuration
                    };
                    
                    return event;
                } catch (error) {
                    console.error('Error converting task:', error);
                    return null;
                }
            })
            .filter((event): event is IStaffCalendarEvent => event !== null);
    }, [selectedTeam]);
    
    // Cálculo dos dias da semana
    const weekDays = useMemo(() => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [selectedDate]);

    return (
        <div className="flex h-[100vh] bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl">
            {/* Sidebar */}
            <div className="w-80 flex flex-col h-full bg-gradient-to-b from-blue-900/50 to-cyan-900/50 border-r border-blue-800/30 rounded-tl-xl">
                {/* Cabeçalho */}
                <div className="flex-shrink-0 p-4 border-b border-blue-800/30">
                    <h2 className="text-lg font-semibold text-white">Equipes</h2>
                    <p className="text-sm text-blue-300/80">{teams.length} equipes no departamento</p>
                </div>

                {/* Lista de Equipes */}
                <div className="h-48">
                    <ScrollArea className="h-full">
                        <div className="p-2 space-y-2">
                            {teams.map((team) => (
                                <button
                                    key={team.id}
                                    onClick={() => onSelectTeam(team)}
                                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 
                                            ${selectedTeam?.id === team.id
                                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-blue-500'
                                                : 'hover:bg-blue-800/30'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-white">{team.name}</h3>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-blue-300/80">{team.department}</span>
                                                <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                                                    {team.shift}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-300/80" />
                                            <span className="text-sm text-blue-300/80">{team.members.length}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Lista de Eventos */}
                <div className="flex-shrink-0 h-64 border-t border-blue-800/30 bg-gradient-to-b from-blue-900/30 to-cyan-900/30">
                    {selectedTeam ? (
                        <>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white">Eventos da Equipe</h3>
                                <p className="text-sm text-blue-300/80">
                                    {allEvents.length} eventos programados
                                </p>
                            </div>
                            <StaffEventsList 
                                events={allEvents} 
                                onEventClick={handleEventClick} 
                            />
                        </>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center p-6">
                            <CalendarDays className="w-12 h-12 text-slate-500 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">
                                Selecione uma Equipe
                            </h3>
                            <p className="text-sm text-slate-400 text-center">
                                Escolha uma equipe para visualizar seus eventos e tarefas
                            </p>
                        </div>
                    )}
                </div>

                {/* MiniCalendário */}
                <MiniCalendar 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate}        
                />
            </div>

            {/* Área Principal */}
            <div className="flex-1 flex flex-col">
                <CalendarHeader
                    currentUser={currentUser}
                    view={view}
                    setView={setView}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    calendarContext={'equipes'}
                />

                <div className="flex-1 flex flex-col min-h-0">
                    <StaffWeekView
                        weekDays={weekDays}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        events={allEvents}
                    />

                    <div className="flex-1 overflow-auto relative time-grid-container">
                        {!selectedTeam && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-slate-900/90 to-blue-950/90">
                                <div className="text-center p-8 rounded-3xl bg-slate-800/60 shadow-xl border border-slate-700/50">
                                    <div className="inline-flex p-6 rounded-full bg-slate-700/50 ring-4 ring-slate-600/30 mb-6">
                                        <CalendarDays className="w-12 h-12 text-slate-300 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-4">
                                        Selecione uma Equipe
                                    </h3>
                                    <p className="text-slate-300">
                                        Escolha uma equipe na lista ao lado para visualizar suas tarefas e compromissos no calendário
                                    </p>
                                </div>
                            </div>
                        )}
                        <StaffTimeGrid
                            weekDays={weekDays}
                            events={allEvents}
                            hourHeight={80}
                            onEventClick={handleEventClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};