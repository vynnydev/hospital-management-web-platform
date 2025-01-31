import { motion } from 'framer-motion';
import { ISubCard } from '@/types/analytics-types';

export const SubCard: React.FC<ISubCard> = ({ title, icon: Icon, gradient, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
    >
      <div className="flex items-center gap-2 text-white">
        <Icon className="h-5 w-5" />
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      <div className="mt-2 text-sm text-white/90 leading-relaxed">
        {content || "Conteúdo não disponível"}
      </div>
    </motion.div>
  );
};