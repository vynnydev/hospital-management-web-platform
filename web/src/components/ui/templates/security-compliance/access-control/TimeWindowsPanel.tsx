/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Label } from '@/components/ui/organisms/label';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Clock, PlusCircle, Trash2, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { useToast } from '@/components/ui/hooks/use-toast';

interface ITimeWindows {
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
  id: string;
  roles?: string[];
}

interface TimeWindowsPanelProps {
  enabled: boolean;
  timeWindows: ITimeWindows[];
  onChange: (allowedTimeWindows: { dayOfWeek: number[]; startTime: string; endTime: string }[]) => void;
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateTimeWindows: (timeWindows: ITimeWindows[]) => void;
  loading: boolean;
}

export const TimeWindowsPanel: React.FC<TimeWindowsPanelProps> = ({ 
  enabled, 
  timeWindows, 
  onToggleEnabled, 
  onUpdateTimeWindows,
  loading 
}) => {
  const [windows, setWindows] = useState<ITimeWindows[]>(timeWindows);
  const { toast } = useToast();
  
  // Helper to get day name
  const getDayName = (dayIndex: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
  };

  // Add a new time window
  const handleAddWindow = () => {
    const newWindow: ITimeWindows = {
      id: `tw-${Date.now()}`,
      dayOfWeek: [1, 2, 3, 4, 5], // Mon-Fri by default
      startTime: '08:00',
      endTime: '18:00'
    };
    
    const updatedWindows = [...windows, newWindow];
    setWindows(updatedWindows);
    onUpdateTimeWindows(updatedWindows);
    
    toast({
      title: "Janela de tempo adicionada",
      description: "Nova janela de tempo adicionada com valores padrão.",
      variant: "default",
    });
  };

  // Remove a time window
  const handleRemoveWindow = (id: string) => {
    const updatedWindows = windows.filter(window => window.id !== id);
    setWindows(updatedWindows);
    onUpdateTimeWindows(updatedWindows);
    
    toast({
      title: "Janela de tempo removida",
      description: "A janela de tempo foi removida com sucesso.",
      variant: "default",
    });
  };

  // Update a time window
  const handleUpdateWindow = (id: string, field: keyof ITimeWindows, value: any) => {
    const updatedWindows = windows.map(window => {
      if (window.id === id) {
        return { ...window, [field]: value };
      }
      return window;
    });
    
    setWindows(updatedWindows);
    onUpdateTimeWindows(updatedWindows);
  };

  // Toggle day of week
  const handleToggleDay = (windowId: string, dayIndex: number, checked: boolean) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    let newDays: number[];
    if (checked) {
      newDays = [...window.dayOfWeek, dayIndex].sort();
    } else {
      newDays = window.dayOfWeek.filter(day => day !== dayIndex);
    }
    
    handleUpdateWindow(windowId, 'dayOfWeek', newDays);
  };

  return (
    <Card className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="h-5 w-5 text-primary dark:text-primary-400" />
              Janelas de Tempo
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Defina horários específicos em que o acesso ao sistema é permitido
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {enabled ? 'Habilitado' : 'Desabilitado'}
            </span>
            <Switch 
              checked={enabled} 
              onCheckedChange={onToggleEnabled}
              aria-label="Ativar restrição de janelas de tempo"
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={enabled ? '' : 'opacity-50 pointer-events-none'}>
          {windows.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Nenhuma janela de tempo configurada. Os usuários podem fazer login a qualquer momento.
              </p>
              <Button 
                onClick={handleAddWindow} 
                className="mt-2 bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Janela de Tempo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {windows.map((window, index) => (
                <div key={window.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-4 bg-white dark:bg-gray-900">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Janela #{index + 1}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWindow(window.id)}
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dias da semana</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map(day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`day-${window.id}-${day}`}
                              checked={window.dayOfWeek.includes(day)}
                              onCheckedChange={(checked) => 
                                handleToggleDay(window.id, day, checked === true)
                              }
                              className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                            />
                            <Label 
                              htmlFor={`day-${window.id}-${day}`}
                              className="text-sm font-normal text-gray-700 dark:text-gray-300"
                            >
                              {getDayName(day).substring(0, 3)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Horário</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label 
                            htmlFor={`start-time-${window.id}`} 
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            Início
                          </Label>
                          <Input 
                            id={`start-time-${window.id}`}
                            type="time"
                            value={window.startTime}
                            onChange={(e) => 
                              handleUpdateWindow(window.id, 'startTime', e.target.value)
                            }
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <Label 
                            htmlFor={`end-time-${window.id}`} 
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            Fim
                          </Label>
                          <Input 
                            id={`end-time-${window.id}`}
                            type="time"
                            value={window.endTime}
                            onChange={(e) => 
                              handleUpdateWindow(window.id, 'endTime', e.target.value)
                            }
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Aplicar a</Label>
                    <Select
                      value={window.roles?.length ? 'custom' : 'all'}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleUpdateWindow(window.id, 'roles', undefined);
                        } else if (value === 'custom' && !window.roles) {
                          handleUpdateWindow(window.id, 'roles', ['Administrador']);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Selecione os papéis" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="all" className="text-gray-900 dark:text-white">Todos os usuários</SelectItem>
                        <SelectItem value="custom" className="text-gray-900 dark:text-white">Papéis específicos</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {window.roles?.length && window.roles?.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {['Administrador', 'Médico', 'Enfermeiro', 'Atendente', 'Técnico'].map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`role-${window.id}-${role}`}
                                checked={window.roles?.includes(role)}
                                onCheckedChange={(checked) => {
                                  const roles = window.roles || [];
                                  if (checked) {
                                    handleUpdateWindow(
                                      window.id, 
                                      'roles', 
                                      [...roles, role]
                                    );
                                  } else {
                                    handleUpdateWindow(
                                      window.id, 
                                      'roles', 
                                      roles.filter(r => r !== role)
                                    );
                                  }
                                }}
                                className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                              />
                              <Label 
                                htmlFor={`role-${window.id}-${role}`}
                                className="text-sm font-normal text-gray-700 dark:text-gray-300"
                              >
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 text-xs font-normal border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Info className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      {window.dayOfWeek.length === 7 
                        ? 'Todos os dias' 
                        : window.dayOfWeek.map(d => getDayName(d).substring(0, 3)).join(', ')
                      }: {window.startTime} - {window.endTime}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={handleAddWindow}
                className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar outra janela de tempo
              </Button>
            </div>
          )}
        </div>
        
        {enabled && windows.length > 0 && (
          <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
            <Info className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium">Atenção:</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Fora dos horários definidos, os usuários não conseguirão fazer login no sistema. 
                Certifique-se de configurar janelas de tempo que cubram todas as necessidades operacionais, 
                incluindo emergências e plantões.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Última atualização: {new Date().toLocaleDateString()}
        </div>
        <Button 
          disabled={!enabled || loading}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          Salvar Alterações
        </Button>
      </CardFooter>
    </Card>
  );
};