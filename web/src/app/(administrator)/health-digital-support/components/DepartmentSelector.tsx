import { useMemo } from 'react';
import { IDepartment } from '@/types/hospital-network-types';

interface DepartmentSelectorProps {
  departments: IDepartment[];
  selectedDepartmentId: string;
  onChange: (departmentId: string) => void;
}

export default function DepartmentSelector({
  departments,
  selectedDepartmentId,
  onChange
}: DepartmentSelectorProps) {
  // Remover duplicatas e ordenar por nome
  const uniqueDepartments = useMemo(() => {
    const uniqueMap = new Map<string, IDepartment>();
    
    departments.forEach(dept => {
      if (!uniqueMap.has(dept.name)) {
        uniqueMap.set(dept.name, dept);
      }
    });
    
    return Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [departments]);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Departamento*
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uniqueDepartments.map((dept) => (
          <div
            key={dept.name}
            onClick={() => onChange(dept.name)}
            className={`p-4 border rounded-md cursor-pointer transition-colors ${
              selectedDepartmentId === dept.name
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50/30'
            }`}
          >
            <div className="font-medium mb-1">{dept.name}</div>
            <div className="text-sm text-gray-600">
              {dept.rooms.length} salas - {dept.rooms.reduce((acc, room) => acc + (room.beds?.length || 0), 0)} leitos
            </div>
          </div>
        ))}
      </div>
      {uniqueDepartments.length === 0 && (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Nenhum departamento disponível
        </div>
      )}
    </div>
  );
}