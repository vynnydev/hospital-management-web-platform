import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Input } from '@/components/ui/organisms/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';
import { 
  AlertTriangle, 
  Tag, 
  MessageSquare,
  Info
} from 'lucide-react';
import { ITransaction } from '@/types/payment-types';

type ActionType = 'dispute' | 'note' | 'tag' | 'details';

interface TransactionActionDialogProps {
  type: ActionType;
  open: boolean;
  onClose: () => void;
  transaction: ITransaction | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  formatDateTime: (dateTime: string) => string;
  formatAmount: (amount: number, currency?: string) => string;
  getCardHolderName: (cardId: string) => string;
  getDepartmentName: (departmentId?: string) => string;
  formatPaymentMethod: (method: string) => string;
  formatCategory: (category: string) => string;
  onConfirm: () => Promise<void>;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  title: string; // Added title property
}

export const TransactionActionDialog: React.FC<TransactionActionDialogProps> = ({
  type,
  open,
  onClose,
  transaction,
  onConfirm,
  inputValue,
  onInputChange,
  formatDateTime,
  formatAmount,
  getCardHolderName,
  getDepartmentName,
  formatPaymentMethod,
  formatCategory
}) => {
  if (!transaction) return null;

  const getTitle = () => {
    switch (type) {
      case 'dispute': return 'Contestar Transação';
      case 'note': return 'Adicionar Nota';
      case 'tag': return 'Adicionar Tag';
      case 'details': return 'Detalhes da Transação';
      default: return '';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'dispute':
        return 'Informe o motivo da contestação para esta transação.';
      case 'note':
        return 'Adicione uma nota para documentar informações adicionais sobre esta transação.';
      case 'tag':
        return 'Adicione uma tag para categorizar esta transação.';
      case 'details':
        return `Transação em ${transaction.merchant} no valor de ${formatAmount(transaction.amount, transaction.currency)}`;
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'dispute': return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'note': return <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'tag': return <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'details': return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default: return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'dispute':
        return (
          <Textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Descreva o motivo da contestação..."
            className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          />
        );
      case 'note':
        return (
          <Textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Digite sua nota sobre esta transação..."
            className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          />
        );
      case 'tag':
        return (
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Digite uma tag..."
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          />
        );
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comerciante</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">{transaction.merchant}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {formatAmount(transaction.amount, transaction.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data/Hora</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {formatDateTime(transaction.timestamp)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {formatCategory(transaction.category)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cartão</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {getCardHolderName(transaction.cardId)} (**** {transaction.cardId})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Departamento</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {getDepartmentName(transaction.departmentId)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Método de Pagamento</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {formatPaymentMethod(transaction.paymentMethod)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nº de Referência</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {transaction.referenceNumber}
                </p>
              </div>
            </div>
            
            {transaction.description && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</p>
                <p className="text-base text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  {transaction.description}
                </p>
              </div>
            )}
            
            {transaction.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notas</p>
                <p className="text-base text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  {transaction.notes}
                </p>
              </div>
            )}
            
            {transaction.tags && transaction.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {transaction.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {transaction.location && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Localização</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {transaction.location}
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (type === 'details') {
      return (
        <Button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Fechar
        </Button>
      );
    }

    return (
      <>
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!inputValue.trim()}
          className={`${
            type === 'dispute'
              ? 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
          }`}
        >
          Confirmar
        </Button>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-800 dark:text-gray-100">
            {getIcon()}
            <span className="ml-2">{getTitle()}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderContent()}
        </div>
        
        <DialogFooter>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};