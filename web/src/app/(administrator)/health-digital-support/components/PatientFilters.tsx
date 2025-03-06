/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

interface PatientFiltersProps {
  onChange: (filters: Record<string, any>) => void;
  activeFilters: Record<string, any>;
}

export default function PatientFilters({ onChange, activeFilters }: PatientFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = (category: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (value === '') {
      // Se o valor for vazio, remover o filtro
      delete newFilters[category];
    } else {
      // Caso contrário, atualizar o valor do filtro
      newFilters[category] = value;
    }
    
    onChange(newFilters);
  };
  
  const clearFilters = () => {
    onChange({});
  };
  
  const activeFiltersCount = Object.keys(activeFilters).length;
  
  return (
    <div className="border border-gray-200 rounded-lg">
      <div 
        className="p-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-700">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <span className="text-gray-400">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </div>
      
      {isOpen && (
        <div className="p-3 border-t border-gray-200 space-y-4">
          {/* Filtro por Gênero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gênero
            </label>
            <select
              value={activeFilters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          {/* Filtro por Tipo Sanguíneo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo Sanguíneo
            </label>
            <select
              value={activeFilters.bloodType || ''}
              onChange={(e) => handleFilterChange('bloodType', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          {/* Filtro por Tipo de Convênio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Convênio
            </label>
            <select
              value={activeFilters.insuranceType || ''}
              onChange={(e) => handleFilterChange('insuranceType', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="Particular">Particular</option>
              <option value="Convênio">Convênio</option>
              <option value="SUS">SUS</option>
            </select>
          </div>
          
          {/* Filtro por Status (se houver admissão) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status de Atendimento
            </label>
            <select
              value={activeFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="Aguardando Atendimento">Aguardando Atendimento</option>
              <option value="Em Triagem">Em Triagem</option>
              <option value="Em Atendimento">Em Atendimento</option>
              <option value="Em Observação">Em Observação</option>
              <option value="Em Procedimento">Em Procedimento</option>
              <option value="Em Recuperação">Em Recuperação</option>
              <option value="Alta">Alta</option>
              <option value="Transferido">Transferido</option>
            </select>
          </div>
          
          {/* Botão para limpar todos os filtros */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-full py-2 text-sm text-primary-600 hover:text-primary-800"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}