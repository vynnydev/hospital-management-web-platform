import React from 'react';

interface TriggerFieldsetProps {
  trigger: 'message_received' | 'keyword' | 'scheduled' | 'no_response';
  condition: string;
  onChange: (condition: string) => void;
}

export const TriggerFieldset: React.FC<TriggerFieldsetProps> = ({
  trigger,
  condition,
  onChange
}) => {
  // Mensagem recebida não tem configurações adicionais
  if (trigger === 'message_received') {
    return null;
  }
  
  // Conteúdo específico para cada tipo de trigger
  switch (trigger) {
    case 'keyword':
      return (
        <div>
          <label htmlFor="rule-condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Palavras-chave
          </label>
          <input
            id="rule-condition"
            type="text"
            value={condition}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Ex: ajuda, suporte, dúvida (separadas por vírgula)"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Listagem de palavras-chave separadas por vírgula
          </p>
        </div>
      );
      
    case 'scheduled':
      return (
        <div>
          <label htmlFor="rule-condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Agendamento (Cron)
          </label>
          <input
            id="rule-condition"
            type="text"
            value={condition}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Ex: 0 9 * * 1-5 (Seg-Sex às 9h)"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Expressão cron para definir quando a regra será executada
          </p>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
            <p className="font-medium mb-1">Exemplos de expressões cron:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><code>0 9 * * *</code> - Todos os dias às 9h</li>
              <li><code>0 9 * * 1-5</code> - Segunda a sexta às 9h</li>
              <li><code>0 9,15 * * *</code> - Todos os dias às 9h e 15h</li>
              <li><code>0 */3 * * *</code> - A cada 3 horas</li>
            </ul>
          </div>
        </div>
      );
      
    case 'no_response':
      return (
        <div>
          <label htmlFor="rule-condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tempo sem resposta (horas)
          </label>
          <input
            id="rule-condition"
            type="number"
            min="1"
            value={condition}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Ex: 24"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Número de horas sem resposta que acionará a automação
          </p>
        </div>
      );
      
    default:
      return null;
  }
};