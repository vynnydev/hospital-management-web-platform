import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/hooks/use-toast";
import { Button } from '@/components/ui/organisms/button';

interface RepositionActionsBarProps {
  isReorderMode: boolean;
  setIsReorderMode: (value: boolean) => void;
  onSave?: () => void;
  initialSectionsOrder: string[];
  currentSectionsOrder: string[];
}

export const RepositionActionsBar: React.FC<RepositionActionsBarProps> = ({
  isReorderMode,
  setIsReorderMode,
  onSave,
  initialSectionsOrder,
  currentSectionsOrder
}) => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const hasOrderChanged = JSON.stringify(initialSectionsOrder) !== JSON.stringify(currentSectionsOrder);
    setHasChanges(hasOrderChanged);
  }, [initialSectionsOrder, currentSectionsOrder]);

  const handleExit = () => {
    if (hasChanges) {
      setShowConfirmation(true);
    } else {
      setIsReorderMode(false);
    }
  };

  const handleSave = () => {
    onSave?.();
    toast({
      title: "Operação bem sucedida",
      description: "A nova ordem dos componentes foi salva.",
      variant: "default", // Usando 'default' para sucesso
    });
    setIsReorderMode(false);
  };

  const handleDiscardChanges = () => {
    toast({
      title: "Alterações descartadas",
      description: "As mudanças na ordem dos componentes foram descartadas.",
      variant: "destructive",
    });
    setIsReorderMode(false);
  };

  return (
    <AnimatePresence>
      {isReorderMode && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-sm border-b border-gray-700 shadow-xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Lado Esquerdo - Informações */}
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-full transition-colors duration-200
                ${hasChanges ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-400'}
              `}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium">Modo de Reposicionamento</h3>
                <p className="text-sm text-gray-400">
                  {hasChanges 
                    ? "Alterações detectadas. Salve para manter o novo layout." 
                    : "Organize os componentes usando as setas para cima ou para baixo."}
                </p>
              </div>
            </div>

            {/* Lado Direito - Botões de Ação */}
            <div className="flex items-center space-x-3">
              {showConfirmation ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-3 bg-red-500/10 px-4 py-2 rounded-lg"
                >
                  <span className="text-red-400 text-sm">Descartar alterações?</span>
                  <Button
                    onClick={handleDiscardChanges}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-700"
                  >
                    Não
                  </Button>
                </motion.div>
              ) : (
                <>
                  <Button
                    onClick={handleExit}
                    variant="outline"
                    className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Sair
                  </Button>

                  {hasChanges && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Layout
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};