import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { SubCard } from './SubCard';
import { ContentLine } from './ContentLine';
import { ISection } from '@/types/analytics-types';

interface IAnalyticsSectionProps extends ISection {
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const AnalyticsSection: React.FC<IAnalyticsSectionProps> = ({
  title,
  icon: Icon,
  gradient,
  tooltip,
  subCards,
  lines,
  actionPlan,
  isExpanded,
  onToggle,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br ${gradient} backdrop-blur-sm`}
    >
      <div className="p-8 text-white backdrop-blur-sm bg-black/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-sm text-white/80 mt-1 cursor-help">
                    Clique para mais detalhes
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronDownIcon 
              className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subCards.map((subCard, subIndex) => (
                  <SubCard key={subIndex} {...subCard} />
                ))}
              </div>
              
              <div className="border-t rounded-xl border-white/10 pt-4">
                <div className="flex flex-col gap-6">
                  {lines.map((column, colIndex) => (
                    <ContentLine key={colIndex} {...column} />
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                    Plano de Ação
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {actionPlan || "Plano de ação não disponível"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};