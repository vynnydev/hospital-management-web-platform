import React from 'react';
import { Sparkles, X, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MinimizedAssistantProps {
  onMaximize: () => void;
  onClose: () => void;
  unreadCount: number;
}

export const MinimizedAssistant: React.FC<MinimizedAssistantProps> = ({
  onMaximize,
  onClose,
  unreadCount
}) => {
  return (
    <motion.div
      className="fixed top-36 right-32 w-[500px] z-50 pointer-events-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div 
        className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-700 dark:to-cyan-700 shadow-md pointer-events-auto"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-white mr-2" />
            <div>
              <h3 className="font-medium text-sm">Assistente H24</h3>
              <p className="text-xs text-indigo-100 dark:text-indigo-200">
                Sua assistente inteligente para gestão hospitalar
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount} {unreadCount === 1 ? 'alerta' : 'alertas'}
              </span>
            )}
            
            <div className="flex space-x-1">
              <button 
                onClick={onMaximize}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
                aria-label="Maximizar"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
              
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};