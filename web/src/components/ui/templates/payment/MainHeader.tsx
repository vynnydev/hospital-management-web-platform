import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { LogOut, PlusCircle } from 'lucide-react';

interface MainHeaderProps {
  onAddCard: () => void;
  onLogout: () => void;
  canManageCards: boolean;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  onAddCard,
  onLogout,
  canManageCards
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          Gerenciamento de Pagamentos
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie os cartões e transações do hospital de forma segura
        </p>
      </div>
      
      <div className="flex space-x-2">
        {canManageCards && (
          <Button 
            onClick={onAddCard}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Novo Cartão
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sair
        </Button>
      </div>
    </div>
  );
};