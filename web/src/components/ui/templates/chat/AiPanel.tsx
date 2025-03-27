/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Pill, 
  Heart, 
  Ambulance, 
  Calendar, 
  UserPlus, 
  ChevronRight,
  User,
  ExternalLink,
  RefreshCcw,
  BookOpen,
  Stethoscope,
  AlertCircle
} from 'lucide-react';
import { IAiPanelProps } from '@/types/chat-types';

export const AiPanel: React.FC<IAiPanelProps> = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Função para mostrar/esconder seções
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="w-1/4 border-l dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/30">
        <h3 className="font-medium text-indigo-900 dark:text-indigo-100 flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Assistente Cognitiva
        </h3>
        <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
          Inteligência artificial integrada para apoio clínico
        </p>
      </div>
      
      {/* Conteúdo do painel */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Ferramentas rápidas */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ferramentas rápidas</h4>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all">
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">Prontuários</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all">
              <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">Medicações</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all">
              <Heart className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">Sinais Vitais</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all">
              <Ambulance className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">Emergências</span>
            </button>
          </div>
        </div>
        
        {/* Perguntas sugeridas */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Perguntas sugeridas</h4>
          <div className="space-y-2">
            <button className="w-full p-2 text-left text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              Quais protocolos para manejo de paciente hipertenso?
            </button>
            <button className="w-full p-2 text-left text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              Valores de referência para exames cardíacos
            </button>
            <button className="w-full p-2 text-left text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              Resumir dados do paciente João Silva
            </button>
          </div>
        </div>
        
        {/* Pacientes recentes */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pacientes recentes</h4>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">João Silva</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">UTI-101 • Pós-cirúrgico cardíaco</p>
              </div>
              <button className="ml-auto p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Maria Santos</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">ENF-201 • Recuperação artroplastia</p>
              </div>
              <button className="ml-auto p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Recursos médicos */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recursos médicos</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Protocolos clínicos</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Guias e diretrizes atualizados</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              <Stethoscope className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Diagnósticos diferenciais</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Assistente de diagnóstico</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Análises disponíveis */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Análises disponíveis</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Previsão de alta</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Análise preditiva de tempo de internação</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Sugestão de especialistas</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Recomendação para consultas</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
              <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Alertas de interação medicamentosa</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Verificação de segurança</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Rodapé do painel */}
        <div className="pt-6 mt-6 border-t dark:border-gray-700">
          <button className="w-full flex items-center justify-center p-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded">
            <RefreshCcw className="h-4 w-4 mr-2" />
            <span>Atualizar sugestões</span>
          </button>
        </div>
      </div>
    </div>
  );
};