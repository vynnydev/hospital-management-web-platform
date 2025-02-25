import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { IDepartmentSettings, IEventType } from '@/types/settings-types';

interface ICalendarFiltersProps {
    departments: IDepartmentSettings[];
    eventTypes: IEventType[];
    selectedDepartments: string[];
    selectedEventTypes: string[];
    onDepartmentChange: (departmentId: string, checked: boolean) => void;
    onEventTypeChange: (typeId: string) => void;
    onApplyFilters: () => void;
}

export const CalendarFilters: React.FC<ICalendarFiltersProps> = ({
  departments,
  eventTypes,
  selectedDepartments,
  selectedEventTypes,
  onDepartmentChange,
  onEventTypeChange,
  onApplyFilters
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Departamentos
          </label>
          <div className="space-y-1">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="dept-all" 
                className="mr-2" 
                checked={selectedDepartments.length === departments.length}
                onChange={(e) => {
                  // Selecionar ou desselecionar todos
                  departments.forEach(dept => {
                    onDepartmentChange(dept.id, e.target.checked);
                  });
                }}
              />
              <label htmlFor="dept-all" className="text-sm">Todos</label>
            </div>
            
            {departments.map(dept => (
              <div key={dept.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`dept-${dept.id}`} 
                  className="mr-2" 
                  checked={selectedDepartments.includes(dept.id)}
                  onChange={(e) => onDepartmentChange(dept.id, e.target.checked)}
                />
                <label htmlFor={`dept-${dept.id}`} className="text-sm">{dept.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipos de Evento
          </label>
          <div className="flex items-center space-x-1">
            {eventTypes.map(type => (
              <Button 
                key={type.id}
                size="sm" 
                variant={selectedEventTypes.includes(type.id) ? "default" : "outline"} 
                className="flex-1 text-xs"
                onClick={() => onEventTypeChange(type.id)}
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={onApplyFilters}
        >
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};

// Exemplos para uso em outros componentes
export const sampleDepartments: IDepartmentSettings[] = [
  { id: 'emergency', name: 'Emergência' },
  { id: 'surgery', name: 'Centro Cirúrgico' },
  { id: 'icu', name: 'UTI' },
  { id: 'admin', name: 'Administrativo' }
];

export const sampleEventTypes: IEventType[] = [
  { id: 'surgery', name: 'Cirurgias' },
  { id: 'meeting', name: 'Reuniões' },
  { id: 'maintenance', name: 'Manutenção' }
];