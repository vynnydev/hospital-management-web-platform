import React, { useState } from 'react';
import { BadgeInfo, Brain } from 'lucide-react';
import { Button } from "@/components/ui/organisms/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/organisms/select";
import { ScrollArea } from "@/components/ui/organisms/scroll-area";
import { MetricCard } from './AIMetricCard';
import { IMetricSuggestion } from '@/types/ai-metric';

interface MetricSuggestionListProps {
  suggestions: IMetricSuggestion[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const MetricSuggestionList: React.FC<MetricSuggestionListProps> = ({
  suggestions,
  onApprove,
  onReject
}) => {
  // Estado para filtro de sugestões
  const [suggestionFilter, setSuggestionFilter] = useState('all');

  // Filtrar as sugestões com base no filtro selecionado
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (suggestionFilter === 'all') return true;
    if (suggestionFilter === 'approved') return suggestion.status === 'approved';
    if (suggestionFilter === 'rejected') return suggestion.status === 'rejected';
    if (suggestionFilter === 'pending') return suggestion.status === 'suggested';
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho fixo */}
      <div className="p-4 border-b border-indigo-900/30 bg-[#252A3D] flex justify-between items-center">
        <h3 className="text-lg font-medium text-white flex items-center">
          <span className="mr-2">Sugestões de Métricas</span>
          <span className="text-sm bg-indigo-600 text-white rounded px-2 py-0.5">
            {suggestions.filter(s => s.status === 'suggested').length} pendentes
          </span>
        </h3>
        <Select 
          value={suggestionFilter} 
          onValueChange={setSuggestionFilter}
        >
          <SelectTrigger className="w-40 h-8 bg-[#1E2233] border-indigo-800/30 text-sm">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1E2233] border-indigo-800/30">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovadas</SelectItem>
            <SelectItem value="rejected">Rejeitadas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Conteúdo com rolagem */}
      <ScrollArea className="flex-1 p-4" type="always">
        {filteredSuggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <BadgeInfo className="h-16 w-16 text-indigo-700/30 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-300 mb-2">Nenhuma sugestão disponível</h3>
            <p className="text-indigo-200/70 mb-6 max-w-md">
              Peça à IA para analisar seus dados e gerar sugestões de métricas personalizadas para o seu contexto
            </p>
            <Button 
              onClick={() => {
                // Este botão apenas mostra como guiar o usuário de volta ao chat
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Brain className="h-5 w-5 mr-2" />
              Iniciar Análise de Dados
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {/* Contador e resumo das sugestões */}
            <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-800/30 mb-6">
              <p className="text-indigo-200">
                <span className="font-medium">{filteredSuggestions.length}</span> métricas encontradas.
                {suggestionFilter === 'all' && (
                  <span className="ml-2">
                    (
                    <span className="text-green-400">{suggestions.filter(s => s.status === 'approved').length}</span> aprovadas,
                    <span className="text-indigo-400">{suggestions.filter(s => s.status === 'suggested').length}</span> pendentes,
                    <span className="text-red-400">{suggestions.filter(s => s.status === 'rejected').length}</span> rejeitadas
                    )
                  </span>
                )}
              </p>
            </div>
            
            {filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="transform transition-all duration-200 hover:scale-[1.01]">
                <MetricCard 
                  metric={suggestion}
                  onApprove={onApprove}
                  onReject={onReject}
                  showActions={suggestion.status === 'suggested'}
                />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};