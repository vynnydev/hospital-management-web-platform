import React from 'react';

interface AISuggestion {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface AISuggestionsProps {
  onSuggestionSelect: (description: string) => void;
}

export const AISuggestions = ({ onSuggestionSelect }: AISuggestionsProps) => {
  const suggestions: AISuggestion[] = [
    {
      icon: "🏥",
      title: "Alta Ocupação",
      description: "Alerta: Hospital com ocupação crítica",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: "⚡",
      title: "Otimização",
      description: "Sugestão de redistribuição de pacientes",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📊",
      title: "Performance",
      description: "Análise de métricas operacionais",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionSelect(suggestion.description)}
          className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${suggestion.gradient} transition-opacity`} />
          
          {/* Content */}
          <div className="relative z-10 space-y-3">
            <div className="text-2xl">{suggestion.icon}</div>
            <div className="space-y-1">
              <h3 className="font-semibold group-hover:text-white transition-colors">
                {suggestion.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors">
                {suggestion.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};