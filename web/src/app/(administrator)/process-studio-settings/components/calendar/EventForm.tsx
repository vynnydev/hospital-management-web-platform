import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ClockIcon, MapPin, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Label } from '@/components/ui/organisms/label';
import { format } from 'date-fns';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { useCalendarEvents } from '@/services/hooks/calendar/useCalendarEvents';

interface IEventFormProps {
  onSubmit?: (eventData: any) => void;
  onCancel?: () => void;
  eventId?: string | null;
  initialDate?: string;
  initialDepartment?: string;
}

export const EventForm: React.FC<IEventFormProps> = ({
  onSubmit,
  onCancel,
  eventId = null,
  initialDate,
  initialDepartment
}) => {
  const { staffMembers } = useStaffData();
  const { events, departments, eventTypes, getEvent } = useCalendarEvents(new Date());
  
  // Estados do formulário
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [department, setDepartment] = useState(initialDepartment || '');
  const [date, setDate] = useState(initialDate || format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState('hour');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState('15');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');
  const [priority, setPriority] = useState('medium');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados do evento se estiver editando
  useEffect(() => {
    if (eventId) {
      const eventData = getEvent(eventId);
      if (eventData) {
        setTitle(eventData.title || '');
        setEventType(eventData.type || 'meeting');
        setDepartment(eventData.department || '');
        setDate(eventData.date || format(new Date(), 'yyyy-MM-dd'));
        setStartTime(eventData.startTime || '08:00');
        setEndTime(eventData.endTime || '09:00');
        setLocation(eventData.location || '');
        setDescription(eventData.description || '');
        setNotification(eventData.notification?.toString() || '15');
        setIsRecurring(!!eventData.isRecurring);
        setRecurrencePattern(eventData.recurrencePattern || 'daily');
        setPriority(eventData.status || 'medium');
        setSelectedAttendees(eventData.attendees || []);
      }
    }
  }, [eventId, getEvent]);

  // Calcular horário de término com base na duração
  useEffect(() => {
    if (!eventId) {
      const start = new Date(`2000-01-01T${startTime}`);
      let end;
      
      if (durationType === 'minute') {
        end = new Date(start.getTime() + duration * 60 * 1000);
      } else if (durationType === 'hour') {
        end = new Date(start.getTime() + duration * 60 * 60 * 1000);
      } else {
        // Para dias, simplificar para horário comercial
        end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
      }
      
      setEndTime(format(end, 'HH:mm'));
    }
  }, [startTime, duration, durationType, eventId]);

  // Validar formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!date) {
      newErrors.date = 'A data é obrigatória';
    }
    
    if (!startTime) {
      newErrors.startTime = 'A hora de início é obrigatória';
    }
    
    if (!department) {
      newErrors.department = 'O departamento é obrigatório';
    }
    
    if (duration <= 0) {
      newErrors.duration = 'A duração deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipular envio do formulário
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const eventData = {
      title,
      type: eventType,
      department,
      date,
      startTime,
      endTime,
      duration: Number(duration),
      durationType,
      location,
      description,
      notification: Number(notification),
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
      priority,
      attendees: selectedAttendees,
    };
    
    // Simular uma pequena demora para feedback de carregamento
    setTimeout(() => {
      onSubmit && onSubmit(eventData);
      setIsLoading(false);
    }, 500);
  };

  // Manipular adição/remoção de participantes
  const toggleAttendee = (staffId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId) 
        : [...prev, staffId]
    );
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {eventId ? 'Editar Evento' : 'Novo Evento'}
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Informações básicas */}
        <div>
          <Label htmlFor="title" className={errors.title ? 'text-red-500' : ''}>
            Título {errors.title && <span className="text-red-500">*</span>}
          </Label>
          <Input 
            id="title"
            placeholder="Nome do evento" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.title}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department" className={errors.department ? 'text-red-500' : ''}>
              Departamento {errors.department && <span className="text-red-500">*</span>}
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.department}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="type">
              Tipo
            </Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className={errors.date ? 'text-red-500' : ''}>
              Data {errors.date && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input 
                id="date"
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`pl-9 ${errors.date ? 'border-red-500' : ''}`}
              />
              <CalendarIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.date}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="startTime" className={errors.startTime ? 'text-red-500' : ''}>
              Hora de Início {errors.startTime && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input 
                id="startTime"
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`pl-9 ${errors.startTime ? 'border-red-500' : ''}`}
              />
              <ClockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.startTime}
              </p>
            )}
          </div>
        </div>
        
        {/* Duração e horário de término */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration" className={errors.duration ? 'text-red-500' : ''}>
              Duração {errors.duration && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="duration"
                type="number" 
                min={1}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className={`w-20 ${errors.duration ? 'border-red-500' : ''}`}
              />
              <Select value={durationType} onValueChange={setDurationType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minute">Minutos</SelectItem>
                  <SelectItem value="hour">Horas</SelectItem>
                  <SelectItem value="day">Dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.duration && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.duration}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="endTime">
              Hora de Término (estimada)
            </Label>
            <div className="relative">
              <Input 
                id="endTime"
                type="time" 
                value={endTime}
                readOnly
                className="pl-9 bg-gray-50 dark:bg-gray-800"
              />
              <ClockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Local */}
        <div>
          <Label htmlFor="location">
            Local
          </Label>
          <div className="relative">
            <Input 
              id="location"
              placeholder="Localização" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
            <MapPin className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Prioridade */}
        <div>
          <Label htmlFor="priority">
            Prioridade
          </Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Recorrência */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isRecurring" 
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
            />
            <Label htmlFor="isRecurring" className="cursor-pointer">
              Evento recorrente
            </Label>
          </div>
          
          {isRecurring && (
            <Select value={recurrencePattern} onValueChange={setRecurrencePattern}>
              <SelectTrigger>
                <SelectValue placeholder="Padrão de recorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                <SelectItem value="monthly">Mensalmente</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Participantes */}
        <div>
          <Label className="block mb-2">
            Participantes
          </Label>
          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            <div className="space-y-2">
              {staffMembers.length > 0 ? (
                staffMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`staff-${member.id}`}
                      checked={selectedAttendees.includes(member.id)}
                      onCheckedChange={() => toggleAttendee(member.id)}
                    />
                    <Label htmlFor={`staff-${member.id}`} className="cursor-pointer">
                      {member.name || member.id} {member.department ? `(${member.department})` : ''}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum membro disponível</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Descrição */}
        <div>
          <Label htmlFor="description">
            Descrição
          </Label>
          <Textarea 
            id="description"
            rows={3} 
            placeholder="Detalhes do evento" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        {/* Notificação */}
        <div>
          <Label htmlFor="notification">
            Notificar
          </Label>
          <Select value={notification} onValueChange={setNotification}>
            <SelectTrigger>
              <SelectValue placeholder="Antecedência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sem notificação</SelectItem>
              <SelectItem value="15">15 minutos antes</SelectItem>
              <SelectItem value="30">30 minutos antes</SelectItem>
              <SelectItem value="60">1 hora antes</SelectItem>
              <SelectItem value="1440">1 dia antes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white ml-auto"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {eventId ? 'Atualizar Evento' : 'Agendar Evento'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};