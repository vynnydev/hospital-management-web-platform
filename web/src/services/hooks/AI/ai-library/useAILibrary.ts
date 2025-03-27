import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface AIHistoryItem {
  id: string;
  name: string;
  type: 'metric' | 'alert' | 'workflow' | string;
  date: string;
  preview: string;
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
}

interface UseAILibraryReturn {
  historyItems: AIHistoryItem[];
  promptItems: PromptItem[];
  isHistoryLoading: boolean;
  isPromptsLoading: boolean;
  historyError: string | null;
  promptsError: string | null;
  refetchHistory: () => void;
  refetchPrompts: () => void;
}

/**
 * Hook para buscar os dados da biblioteca de IA, incluindo histórico de geração
 * e biblioteca de prompts da API.
 */
export const useAILibrary = (): UseAILibraryReturn => {
  const [historyItems, setHistoryItems] = useState<AIHistoryItem[]>([]);
  const [promptItems, setPromptItems] = useState<PromptItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isPromptsLoading, setIsPromptsLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [promptsError, setPromptsError] = useState<string | null>(null);

  // Função para buscar o histórico de geração
  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      setHistoryError(null);
      
      const response = await api.get('/ai-generation-history');
      
      // Verificar se a resposta possui o formato correto
      if (response.data && Array.isArray(response.data)) {
        setHistoryItems(response.data);
      } else {
        console.error('Formato de resposta inesperado para o histórico:', response.data);
        setHistoryError('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar histórico de geração:', error);
      setHistoryError('Falha ao carregar o histórico de geração. Tente novamente mais tarde.');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Função para buscar a biblioteca de prompts
  const fetchPrompts = async () => {
    try {
      setIsPromptsLoading(true);
      setPromptsError(null);
      
      const response = await api.get('/ai-prompt-library');
      
      // Verificar se a resposta possui o formato correto
      if (response.data && Array.isArray(response.data)) {
        setPromptItems(response.data);
      } else {
        console.error('Formato de resposta inesperado para os prompts:', response.data);
        setPromptsError('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar biblioteca de prompts:', error);
      setPromptsError('Falha ao carregar a biblioteca de prompts. Tente novamente mais tarde.');
    } finally {
      setIsPromptsLoading(false);
    }
  };

  // Buscar dados ao montar o componente
  useEffect(() => {
    fetchHistory();
    fetchPrompts();
  }, []);

  return {
    historyItems,
    promptItems,
    isHistoryLoading,
    isPromptsLoading,
    historyError,
    promptsError,
    refetchHistory: fetchHistory,
    refetchPrompts: fetchPrompts
  };
};