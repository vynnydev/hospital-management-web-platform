import React from 'react';
import { Plus, MessageSquare, Clock, AlarmClock } from 'lucide-react';

interface NoRulesMessageProps {
  onAddClick: () => void;
}

export const NoRulesMessage: React.FC<NoRulesMessageProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center mb-4 space-x-3">
        <MessageSquare className="w-6 h-6 text-blue-500" />
        <Clock className="w-6 h-6 text-purple-500" />
        <AlarmClock className="w-6 h-6 text-orange-500" />
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 font-medium">
        Nenhuma regra de automação configurada
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1 mb-4">
        As regras de automação permitem enviar mensagens automáticas, categorizar contatos e notificar 
        agentes com base em gatilhos específicos.
      </p>
      
      <div className="space-y-2 max-w-md mx-auto text-left bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplos de automações:</p>
        <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
          <li>Enviar mensagem de boas-vindas quando receber a primeira mensagem</li>
          <li>Responder automaticamente a palavras-chave específicas</li>
          <li>Enviar lembrete de consulta 24h antes do agendamento</li>
          <li>Acompanhar clientes que não responderam após 48h</li>
        </ul>
      </div>
      
      <button
        type="button"
        onClick={onAddClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Primeira Regra
      </button>
    </div>
  );
};