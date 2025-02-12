/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  Layout, 
  Move3d, 
  Maximize2, 
  ArrowRight,
  MonitorUp,
  Grid3x3
} from 'lucide-react';

interface DashboardModeModalOptionsWithoutTVModeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'fullscreen' | 'reposition') => void;
}

export const DashboardModeModalOptionsWithoutTVMode: React.FC<DashboardModeModalOptionsWithoutTVModeProps> = ({
  isOpen,
  onClose,
  onSelectMode
}) => {
    const options = [
        {
          id: 'reposition',
          title: 'Reposicionar',
          description: 'Organize a posição dos componentes na tela',
          icon: <Move3d className="w-6 h-6" />,
          preview: (
            <div className="relative w-full h-32 bg-gray-800/40 rounded-lg overflow-hidden">
              <motion.div
                animate={{
                  x: [0, 20, -20, 0],
                  y: [0, -20, 20, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Grid3x3 className="w-12 h-12 text-blue-400" />
              </motion.div>
            </div>
          )
        }
      ];
    
      return (
        <div className='bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-700 dark:to-cyan-700'>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Gradient Border */}
                  <div className="absolute inset-0 rounded-2xl p-[1px]">
                    <div className="absolute inset-0 bg-gray-900 rounded-2xl" />
                  </div>
      
                  {/* Content */}
                  <div className="relative space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">
                        Modo de Visualização
                      </h2>
                      <p className="text-gray-400">
                        Escolha como você deseja visualizar e organizar seu dashboard
                      </p>
                    </div>
      
                    <div className="grid grid-cols-2 gap-4">
                      {options.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSelectMode(option.id as 'fullscreen' | 'reposition')}
                          className="relative p-4 rounded-xl text-left bg-gray-800/50 hover:bg-gray-800/80 transition-colors duration-200 group"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                {option.icon}
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            </div>
      
                            <div>
                              <h3 className="font-semibold text-white mb-1">
                                {option.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {option.description}
                              </p>
                            </div>
      
                            {option.preview}
                          </div>
                        </motion.button>
                      ))}
                    </div>
      
                    <div className="flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    );
};