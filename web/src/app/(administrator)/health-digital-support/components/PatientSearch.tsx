import { useState, ChangeEvent, FormEvent } from 'react';

interface PatientSearchProps {
  onSearch: (term: string) => void;
}

export default function PatientSearch({ onSearch }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Opcional: busca automática após um tempo sem digitar
    // Implementar usando debounce se desejado
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            placeholder="Buscar por nome, CPF, RG ou cartão SUS..."
            value={searchTerm}
            onChange={handleChange}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 ml-2 text-white bg-primary-600 dark:bg-primary-700 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800"
        >
          Buscar
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Dica: Digite o nome, CPF ou RG do paciente para encontrá-lo rapidamente.
      </p>
    </form>
  );
}