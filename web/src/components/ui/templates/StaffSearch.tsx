import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../organisms/input";

interface SearchComponentProps {
    onSearch?: (query: string) => void;
  }

// Componente de busca para equipes
export const StaffSearch: React.FC<SearchComponentProps> = ({ onSearch }) => {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    };
  
    const toggleSearch = () => {
      setIsSearchOpen(!isSearchOpen);
      if (!isSearchOpen) {
        setTimeout(() => {
          const searchInput = document.getElementById('staff-search');
          searchInput?.focus();
        }, 100);
      } else {
        setSearchQuery('');
        onSearch?.('');
      }
    };
  
    return (
      <>
        <button
          onClick={toggleSearch}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${isSearchOpen 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:bg-white/10'}`}
        >
          {isSearchOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Fechar busca</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Buscar profissional</span>
            </>
          )}
        </button>
  
        {/* Painel de busca animado */}
        <div 
          className={`absolute left-0 right-0 transform transition-all duration-300 ease-in-out ${
            isSearchOpen
              ? 'translate-y-0 opacity-100 visible'
              : '-translate-y-4 opacity-0 invisible'
          }`}
          style={{ 
            top: 'calc(100% + 0.5rem)',
            zIndex: 50
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mx-auto max-w-3xl">
            <div className="relative py-2 px-3">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                id="staff-search"
                type="text"
                placeholder="Digite o nome, ID ou especialidade do profissional..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-8 pl-8 pr-4 bg-transparent border-0 focus:ring-0 
                         text-gray-900 dark:text-white placeholder-gray-500 
                         dark:placeholder-gray-400 text-sm"
              />
            </div>
          </div>
        </div>
    </>
  );
};

// Componente que combina as opções de busca avançada para equipes
export const StaffAdvancedSearch: React.FC<SearchComponentProps> = ({ onSearch }) => {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedFilters, setSelectedFilters] = React.useState({
      shift: '',
      specialty: '',
      status: ''
    });
  
    const shifts = ['Manhã', 'Tarde', 'Noite'];
    const specialties = ['Cardiologia', 'Neurologia', 'Oncologia', 'Ortopedia'];
    const statuses = ['Ativo', 'Em pausa', 'Férias'];
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    };
  
    const handleFilterChange = (filterType: string, value: string) => {
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    };
  
    const clearFilters = () => {
      setSelectedFilters({
        shift: '',
        specialty: '',
        status: ''
      });
      setSearchQuery('');
      onSearch?.('');
    };
  
    const toggleSearch = () => {
      setIsSearchOpen(!isSearchOpen);
      if (!isSearchOpen) {
        setTimeout(() => {
          const searchInput = document.getElementById('staff-advanced-search');
          searchInput?.focus();
        }, 100);
      } else {
        clearFilters();
      }
    };
  
    return (
      <>
        <button
          onClick={toggleSearch}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${isSearchOpen 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:bg-white/10'}`}
        >
          {isSearchOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Fechar busca</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Busca avançada</span>
            </>
          )}
        </button>
  
        {/* Painel de busca avançada animado */}
        <div 
          className={`absolute left-0 right-0 transform transition-all duration-300 ease-in-out ${
            isSearchOpen
              ? 'translate-y-0 opacity-100 visible'
              : '-translate-y-4 opacity-0 invisible'
          }`}
          style={{ 
            top: 'calc(100% + 0.5rem)',
            zIndex: 50
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mx-auto max-w-4xl">
            {/* Barra de busca principal */}
            <div className="relative py-4 px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  id="staff-advanced-search"
                  type="text"
                  placeholder="Buscar por nome, ID, especialidade ou equipe..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full h-10 pl-10 pr-4 bg-transparent border-gray-200 dark:border-gray-700
                           text-gray-900 dark:text-white placeholder-gray-500 
                           dark:placeholder-gray-400 rounded-lg"
                />
              </div>
  
              {/* Filtros */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                {/* Turno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Turno
                  </label>
                  <select
                    value={selectedFilters.shift}
                    onChange={(e) => handleFilterChange('shift', e.target.value)}
                    className="w-full rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-800
                             text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Todos os turnos</option>
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>
  
                {/* Especialidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Especialidade
                  </label>
                  <select
                    value={selectedFilters.specialty}
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                    className="w-full rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-800
                             text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Todas as especialidades</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
  
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-800
                             text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Todos os status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
  
              {/* Botões de ação */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 
                           dark:hover:text-gray-200 transition-colors"
                >
                  Limpar filtros
                </button>
                <button
                  onClick={() => {
                    // Aqui você pode implementar a lógica de busca com os filtros
                    console.log('Filtros:', selectedFilters);
                  }}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90
                           transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};