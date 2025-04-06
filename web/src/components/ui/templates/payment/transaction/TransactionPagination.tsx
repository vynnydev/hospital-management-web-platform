import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  loading?: boolean;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  loading = false
}) => {
  // Configurações para exibição dos botões de página
  const maxVisiblePages = 5;
  
  // Calcula as páginas a serem exibidas
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Se a página atual estiver próxima ao início
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      return Array.from({ length: maxVisiblePages }, (_, i) => i + 1);
    }
    
    // Se a página atual estiver próxima ao fim
    if (currentPage > totalPages - Math.floor(maxVisiblePages / 2)) {
      return Array.from({ length: maxVisiblePages }, (_, i) => totalPages - maxVisiblePages + i + 1);
    }
    
    // Caso a página atual esteja no meio
    const start = currentPage - Math.floor(maxVisiblePages / 2);
    return Array.from({ length: maxVisiblePages }, (_, i) => start + i);
  };
  
  const visiblePages = getVisiblePages();
  
  // Função para ir para a primeira página
  const goToFirstPage = () => {
    if (currentPage !== 1 && !loading) {
      onPageChange(1);
    }
  };
  
  // Função para ir para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };
  
  // Função para ir para a próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Função para ir para a última página
  const goToLastPage = () => {
    if (currentPage !== totalPages && !loading) {
      onPageChange(totalPages);
    }
  };
  
  // Renderiza os botões de paginação
  const renderPageButtons = () => {
    return visiblePages.map(page => (
      <Button
        key={page}
        onClick={() => onPageChange(page)}
        variant={page === currentPage ? 'default' : 'outline'}
        className={`min-w-[40px] h-10 ${
          page === currentPage 
            ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600' 
            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
        disabled={loading}
      >
        {page}
      </Button>
    ));
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {Math.min(10, totalItems)} de {totalItems} transações
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToFirstPage}
            disabled={currentPage === 1 || loading}
            className="h-10 w-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
            className="h-10 w-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="hidden sm:flex space-x-1">
            {renderPageButtons()}
          </div>
          
          <div className="sm:hidden">
            <Select
              value={currentPage?.toString()}
              onValueChange={(value) => onPageChange(parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger className="w-[70px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder={currentPage} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <SelectItem 
                    key={page} 
                    value={page.toString()}
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || loading}
            className="h-10 w-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToLastPage}
            disabled={currentPage === totalPages || loading}
            className="h-10 w-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};