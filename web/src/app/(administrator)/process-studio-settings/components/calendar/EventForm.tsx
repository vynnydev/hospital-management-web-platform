/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';

interface IEventFormProps {
    onSubmit?: (eventData: any) => void;
}
  
export const EventForm: React.FC<IEventFormProps> = ({
    onSubmit
}) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <Input placeholder="Nome do evento" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <Select defaultValue="meeting">
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Reunião</SelectItem>
                <SelectItem value="surgery">Cirurgia</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="training">Treinamento</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hora
              </label>
              <Input type="time" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duração
            </label>
            <div className="flex items-center space-x-2">
              <Input type="number" defaultValue={1} className="w-20" />
              <Select defaultValue="hour">
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Local
            </label>
            <Input placeholder="Localização" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <Textarea rows={3} placeholder="Detalhes do evento" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notificar
            </label>
            <Select defaultValue="15">
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
          
          <Button 
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onSubmit && onSubmit({})}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Agendar Evento
          </Button>
        </CardContent>
      </Card>
    );
};