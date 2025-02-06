import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/organisms/input";

interface SearchComponentProps {
  onSearch?: (query: string) => void;
}

export const PatientSearch: React.FC<SearchComponentProps> = ({ onSearch }) => {
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
        const searchInput = document.getElementById('patient-search');
        searchInput?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  return (
    <div className="relative"> {/* Container relativo para posicionamento */}
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
            <span>Buscar paciente</span>
          </>
        )}
      </button>

      {/* Painel de busca com animação */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 w-[600px] transition-all duration-300 ease-in-out ${
          isSearchOpen
            ? 'opacity-100 translate-y-2 h-auto'
            : 'opacity-0 -translate-y-4 h-0 overflow-hidden'
        }`}
        style={{ zIndex: 50 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="relative py-2 px-3">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <Input
              id="patient-search"
              type="text"
              placeholder="Digite o nome, ID ou diagnóstico do paciente..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-8 pl-8 pr-4 bg-transparent border-0 focus:ring-0 
                       text-gray-900 dark:text-white placeholder-gray-500 
                       dark:placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};