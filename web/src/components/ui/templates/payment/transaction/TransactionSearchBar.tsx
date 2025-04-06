import React, { useState } from 'react';
import { Input } from '@/components/ui/organisms/input';
import { Search } from 'lucide-react';

interface TransactionSearchBarProps {
  onSearch: (term: string) => void;
}

export const TransactionSearchBar: React.FC<TransactionSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <Input
        placeholder="Buscar por estabelecimento, valor ou descrição..."
        className="pl-10 w-full sm:w-auto bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleSearch}
      />
    </div>
  );
};