import React from 'react';
import { Bot, MessageSquare, Brain } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';

interface ICommonQuestion {
  category: string;
  questions: string[];
}

interface ICognitivaAIProps {
  onQuestionSelect: (question: string) => void;
  isGenerating: boolean;
  aiResponse: string;
  onGenerateProtocol: () => void;
}

const commonQuestions: ICommonQuestion[] = [
  {
    category: "Sinais Vitais",
    questions: [
      "Analisar tendências dos sinais vitais",
      "Avaliar risco cardíaco atual",
      "Verificar padrão respiratório"
    ]
  },
  {
    category: "Medicações",
    questions: [
      "Verificar interações medicamentosas",
      "Sugerir ajustes de dosagem",
      "Analisar eficácia do tratamento"
    ]
  },
  {
    category: "Prognóstico",
    questions: [
      "Estimar tempo de recuperação",
      "Avaliar riscos de complicações",
      "Sugerir próximas etapas"
    ]
  }
];

export const CognitivaAI: React.FC<ICognitivaAIProps> = ({
  onQuestionSelect,
  isGenerating,
  aiResponse,
  onGenerateProtocol
}) => {
  return (
    <div className='bg-gradient-to-br from-teal-400 to-blue-500 dark:from-teal-700 dark:to-blue-700 rounded-xl p-1'>
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold">Cognitiva AI - Assistente Inteligente</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {commonQuestions.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                {category.category}
              </h4>
              {category.questions.map((question, qIdx) => (
                <Button
                  key={qIdx}
                  variant="outline"
                  className="w-full justify-start text-left min-h-[4rem] py-3 px-4 
                           bg-white dark:bg-gray-700 hover:bg-blue-50 
                           dark:hover:bg-gray-600 transition-all whitespace-normal"
                  onClick={() => onQuestionSelect(question)}
                >
                  <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">{question}</span>
                </Button>
              ))}
            </div>
          ))}
        </div>

        <div className="relative bg-white dark:bg-gray-700 rounded-xl p-4 min-h-[120px] 
                      border border-gray-200 dark:border-gray-600">
          {isGenerating ? (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
              <span>Cognitiva AI está analisando...</span>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {aiResponse || "Selecione uma pergunta acima ou faça sua própria consulta"}
            </div>
          )}
        </div>

        <Button 
          className="w-full py-6 mt-6 bg-gradient-to-r from-blue-500 to-teal-500 
                    hover:from-blue-600 hover:to-teal-600 text-white font-semibold
                    rounded-xl transition-all"
          onClick={onGenerateProtocol}
        >
          <Brain className="w-5 h-5 mr-2" />
          Gerar Diagrama de Protocolo de Cuidados
        </Button>
      </div>
    </div>
  );
};