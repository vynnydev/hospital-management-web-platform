import { IColumnContent } from '@/types/analytics-types';

export const ContentLine: React.FC<IColumnContent> = ({ title, content }) => {
  return (
    <div className="flex-1 bg-white/10 p-6 rounded-xl">
      <h4 className="text-white/90 font-medium mb-2 text-lg">{title}</h4>
      <div className="text-white/80 text-sm leading-relaxed">
        {content || "Conteúdo não disponível"}
      </div>
    </div>
  );
};