// components/resources/transfers/TransferResourcesButton.tsx
import React from 'react';
import { Truck } from 'lucide-react';

interface ITransferResourcesButtonProps {
  onClick: () => void;
  position?: 'top-right' | 'bottom-right';
  className?: string;
}

export const TransferResourcesButton: React.FC<ITransferResourcesButtonProps> = ({ 
  onClick, 
  position = 'top-right',
  className = ''
}) => {
  const positionClasses = position === 'top-right' 
    ? 'top-52 right-4' 
    : 'bottom-20 right-4';
    
  return (
    <button
      onClick={onClick}
      className={`absolute ${positionClasses} z-20 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 ${className}`}
      title="Transferir Recursos"
    >
      <Truck className="h-8 w-8" />
    </button>
  );
};