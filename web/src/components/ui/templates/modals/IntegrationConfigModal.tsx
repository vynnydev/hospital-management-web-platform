'use client';
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  title: string;
  children: React.ReactNode;
}

export const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
    isOpen,
    onClose,
    onDeactivate,
    title,
    children
  }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Garantir que o foco seja capturado pelo modal e não vá para o campo de busca
    useEffect(() => {
      if (isOpen && modalRef.current) {
        // Pequeno atraso para garantir que o DOM foi renderizado
        setTimeout(() => {
          modalRef.current?.focus();
        }, 50);
      }
    }, [isOpen]);
  
    // Interromper a propagação de eventos para campos do formulário
    const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
    };
  
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          ref={modalRef}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden"
          onClick={stopPropagation}
          onKeyDown={stopPropagation}
          tabIndex={-1} // Torna o div focável, mas não na sequência de tab
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
  
          <div className="p-6">
            {/* Adicionar autocomplete="off" nos componentes de formulário */}
            <div onClick={stopPropagation} onKeyDown={stopPropagation} className="pointer-events-auto">
              {children}
            </div>
          </div>
  
          <div className="flex justify-between space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onDeactivate}
              className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              Desativar Integração
            </button>
            <div>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };