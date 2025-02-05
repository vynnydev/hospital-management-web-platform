import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Command as CommandPrimitive } from 'cmdk';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu = ({ isOpen, onClose }: CommandMenuProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
    >
      <div 
        className="fixed inset-x-0 top-24 mx-auto max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <CommandPrimitive className="w-full">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 h-14">
            <div className="flex items-center flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-gray-400"
                placeholder="Buscar mensagens, usuários ou hospitais..."
              />
            </div>
            <div className="flex items-center gap-2">
              <kbd className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">esc</kbd>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="py-4">
            <div className="px-4 mb-2">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Sugestões</h3>
            </div>
            {/* Lista de sugestões pode ser adicionada aqui */}
          </div>
        </CommandPrimitive>
      </div>
    </div>
  );
};