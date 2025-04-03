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

interface TimeWindow {
  id: string;
  dayOfWeek: number[]; // 0-6 (dom-sáb)
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  roles?: string[]; // which roles this applies to (if empty, applies to all)
}

interface TimeWindowsPanelProps {
  enabled: boolean;
  timeWindows: TimeWindow[];
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateTimeWindows: (timeWindows: TimeWindow[]) => void;
  loading: boolean;
}

export const TimeWindowsPanel: React.FC<TimeWindowsPanelProps> = ({ 
  enabled, 
  timeWindows, 
  onToggleEnabled, 
  onUpdateTimeWindows,
  loading 
}) => {
  const [windows, setWindows] = useState<TimeWindow[]>(timeWindows);
  const { toast } = useToast();
  
  // Helper to get day name
  const getDayName = (dayIndex: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
  };

  // Add a new time window
  const handleAddWindow = () => {
    const newWindow: TimeWindow = {
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
  const handleUpdateWindow = (id: string, field: keyof TimeWindow, value: any) => {
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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Janelas de Tempo
            </CardTitle>
            <CardDescription>
              Defina horários específicos em que o acesso ao sistema é permitido
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {enabled ? 'Habilitado' : 'Desabilitado'}
            </span>
            <Switch 
              checked={enabled} 
              onCheckedChange={onToggleEnabled}
              aria-label="Ativar restrição de janelas de tempo"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={enabled ? '' : 'opacity-50 pointer-events-none'}>
          {windows.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">
                Nenhuma janela de tempo configurada. Os usuários podem fazer login a qualquer momento.
              </p>
              <Button 
                onClick={handleAddWindow} 
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Janela de Tempo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {windows.map((window, index) => (
                <div key={window.id} className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      Janela #{index + 1}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWindow(window.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Dias da semana</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map(day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`day-${window.id}-${day}`}
                              checked={window.dayOfWeek.includes(day)}
                              onCheckedChange={(checked) => 
                                handleToggleDay(window.id, day, checked === true)
                              }
                            />
                            <Label 
                              htmlFor={`day-${window.id}-${day}`}
                              className="text-sm font-normal"
                            >
                              {getDayName(day).substring(0, 3)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Horário</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label 
                            htmlFor={`start-time-${window.id}`} 
                            className="text-xs"
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
                          />
                        </div>
                        <div>
                          <Label 
                            htmlFor={`end-time-${window.id}`} 
                            className="text-xs"
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
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Aplicar a</Label>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os papéis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os usuários</SelectItem>
                        <SelectItem value="custom">Papéis específicos</SelectItem>
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
                              />
                              <Label 
                                htmlFor={`role-${window.id}-${role}`}
                                className="text-sm font-normal"
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
                      className="flex items-center gap-1 text-xs font-normal"
                    >
                      <Info className="h-3 w-3" />
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
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar outra janela de tempo
              </Button>
            </div>
          )}
        </div>
        
        {enabled && windows.length > 0 && (
          <div className="flex items-start p-4 bg-amber-50 rounded-md border border-amber-200">
            <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Atenção:</p>
              <p className="text-xs">
                Fora dos horários definidos, os usuários não conseguirão fazer login no sistema. 
                Certifique-se de configurar janelas de tempo que cubram todas as necessidades operacionais, 
                incluindo emergências e plantões.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-gray-500">
          Última atualização: {new Date().toLocaleDateString()}
        </div>
        <Button disabled={!enabled || loading}>
          Salvar Alterações
        </Button>
      </CardFooter>
    </Card>
  );
};