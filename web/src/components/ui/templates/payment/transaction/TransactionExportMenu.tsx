import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/organisms/dropdown-menu';
import { FileDown, FileText, Table } from 'lucide-react';

interface TransactionExportMenuProps {
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  disabled?: boolean;
}

export const TransactionExportMenu: React.FC<TransactionExportMenuProps> = ({
  onExport,
  disabled = false
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="flex items-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <FileDown className="h-4 w-4 mr-1" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
        <DropdownMenuLabel className="text-gray-800 dark:text-gray-200">
          Formato de Exportação
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
        <DropdownMenuItem 
          onClick={() => onExport('csv')}
          className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/80"
        >
          <Table className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onExport('excel')}
          className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/80"
        >
          <Table className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          Exportar como Excel
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onExport('pdf')}
          className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/80"
        >
          <FileText className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
          Exportar como PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};