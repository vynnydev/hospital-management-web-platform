import React from 'react';
import { Calendar, Building2, Package2, Users, ChevronDown } from 'lucide-react';
import { IHospital } from '@/types/hospital-network-types';
import { TDepartment, TResourceCategory } from '@/types/resources-types';


export interface IResourceFilterBarProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  selectedCategory: TResourceCategory;
  setSelectedCategory: (category: TResourceCategory) => void;
  selectedDepartment: TDepartment;
  setSelectedDepartment: (department: TDepartment) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const ResourceFilterBar: React.FC<IResourceFilterBarProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  selectedCategory,
  setSelectedCategory,
  selectedDepartment,
  setSelectedDepartment,
  selectedYear,
  setSelectedYear
}) => {
  return (
    <div className="absolute top-2 left-2 right-2 z-20 flex space-x-2">
      {/* Hospital Selector */}
      <div className="flex-1">
        <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
          <Building2 className="h-5 w-5 text-blue-400 mr-2" />
          <select 
            className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
            value={selectedHospital ?? ''}
            onChange={(e) => setSelectedHospital(e.target.value || null)}
          >
            <option value="">Selecione um Hospital</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id} className="text-gray-900">
                {hospital.name}
              </option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Resource Type Selector */}
      <div className="flex-1">
        <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
          <Package2 className="h-5 w-5 text-green-400 mr-2" />
          <select 
            className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TResourceCategory)}
          >
            <option value="all" className="text-gray-900">Todos Recursos</option>
            <option value="equipment" className="text-gray-900">Equipamentos</option>
            <option value="supplies" className="text-gray-900">Suprimentos</option>
            <option value="staff" className="text-gray-900">Equipes</option>
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Department Selector */}
      <div className="flex-1">
        <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
          <Users className="h-5 w-5 text-purple-400 mr-2" />
          <select 
            className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as TDepartment)}
          >
            <option value="all" className="text-gray-900">Todos Departamentos</option>
            <option value="uti" className="text-gray-900">UTI</option>
            <option value="enfermaria" className="text-gray-900">Enfermaria</option>
            <option value="centro_cirurgico" className="text-gray-900">Centro Cirúrgico</option>
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex-1">
        <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
          <Calendar className="h-5 w-5 text-orange-400 mr-2" />
          <select 
            className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2024" className="text-gray-900">2024</option>
            <option value="2023" className="text-gray-900">2023</option>
            <option value="2022" className="text-gray-900">2022</option>
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};