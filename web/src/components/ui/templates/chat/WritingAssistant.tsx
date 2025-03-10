import React, { useState, useMemo } from 'react';
import { X, PenTool, CornerDownRight, Check } from 'lucide-react';
import { ISuggestionType, IWritingAssistantProps } from '@/types/chat-types';


export const WritingAssistant: React.FC<IWritingAssistantProps & { onClose: () => void }> = ({ 
  onSuggestionSelect, 
  inputText,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Sugestões contextuais baseadas no texto de entrada
  const contextualSuggestions = useMemo(() => {
    if (!inputText) return [];
    
    const lowerInput = inputText.toLowerCase();
    const suggestions: ISuggestionType[] = [];
    
    if (lowerInput.includes("paciente") || lowerInput.includes("joão") || lowerInput.includes("maria")) {
      suggestions.push(
        { text: "Poderia compartilhar os sinais vitais mais recentes deste paciente?", category: "patient" },
        { text: "Qual é o histórico médico deste paciente?", category: "patient" }
      );
    }
    
    if (lowerInput.includes("pressão") || lowerInput.includes("hipertensão")) {
      suggestions.push(
        { text: "Qual foi a última medição de pressão arterial?", category: "medical" },
        { text: "O paciente tem histórico de hipertensão?", category: "medical" },
        { text: "Quais medicamentos anti-hipertensivos estão sendo administrados?", category: "medical" }
      );
    }
    
    if (lowerInput.includes("exame") || lowerInput.includes("laboratorio") || lowerInput.includes("resultado")) {
      suggestions.push(
        { text: "Os resultados já foram anexados ao prontuário?", category: "procedural" },
        { text: "Quando os novos exames serão realizados?", category: "procedural" }
      );
    }
    
    return suggestions;
  }, [inputText]);
  
  // Filtrar sugestões por categoria, se uma estiver selecionada
  const filteredSuggestions = useMemo(() => {
    // Sugestões comuns para profissionais de saúde
    const commonSuggestions: ISuggestionType[] = [
        { text: "Olá, como posso ajudar hoje?", category: "greeting" },
        { text: "Bom dia, como o paciente está se sentindo?", category: "greeting" },
        { text: "O paciente apresentou alguma alteração nas últimas horas?", category: "patient" },
        { text: "Recomendo monitoramento contínuo dos sinais vitais.", category: "medical" },
        { text: "Por favor, verifique os resultados dos exames mais recentes.", category: "medical" },
        { text: "Podemos agendar uma avaliação multidisciplinar?", category: "procedural" },
        { text: "Vou revisar o prontuário e retorno em seguida.", category: "procedural" },
        { text: "Quais medicamentos foram administrados nas últimas 24 horas?", category: "medical" },
        { text: "Precisamos avaliar a possibilidade de ajuste na medicação.", category: "medical" },
        { text: "Qual foi a última avaliação da equipe de enfermagem?", category: "procedural" }
    ];

    const allSuggestions = [...contextualSuggestions, ...commonSuggestions];
    
    if (activeCategory) {
      return allSuggestions.filter(s => s.category === activeCategory);
    }
    
    return allSuggestions;
  }, [contextualSuggestions, activeCategory]);
  
  // Categorias disponíveis
  const categories = [
    { id: 'greeting', name: 'Saudações', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { id: 'patient', name: 'Paciente', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { id: 'medical', name: 'Médico', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' },
    { id: 'procedural', name: 'Procedimentos', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' }
  ];
  
  return (
    <div className="mb-3">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <PenTool className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-1.5" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sugestões de mensagem</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            aria-label="Fechar assistente"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Filtros por categoria */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex gap-1.5 overflow-x-auto">
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              className={`
                px-2 py-1 rounded-full text-xs font-medium flex items-center whitespace-nowrap
                ${activeCategory === category.id ? category.color : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}
            >
              {activeCategory === category.id && <Check className="h-3 w-3 mr-1" />}
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Lista de sugestões */}
        <div className="p-2 max-h-40 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            <div className="space-y-1.5">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-start"
                  onClick={() => onSuggestionSelect(suggestion.text)}
                >
                  <CornerDownRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              {inputText ? 'Nenhuma sugestão encontrada para este contexto' : 'Digite algo para ver sugestões contextuais'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};