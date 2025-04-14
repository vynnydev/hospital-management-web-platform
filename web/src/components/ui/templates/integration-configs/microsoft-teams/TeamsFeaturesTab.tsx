import React from 'react';
import { MessageSquare, Video, Calendar, FileText, CheckSquare, Bell } from 'lucide-react';
import { TeamsIntegrationSuggestion } from './TeamsIntegrationSuggestion';

interface TeamsFeaturesTabProps {
  features: {
    notifications: boolean;
    chat: boolean;
    meetings: boolean;
    calendar: boolean;
    documents: boolean;
    tasks: boolean;
  };
  toggleFeature: (feature: string) => void;
}

export const TeamsFeaturesTab: React.FC<TeamsFeaturesTabProps> = ({ 
  features, 
  toggleFeature 
}) => {
  const featuresList = [
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Receba alertas e notificações importantes do hospital no Teams',
      icon: <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    },
    {
      id: 'chat',
      title: 'Chat e Mensagens',
      description: 'Comunique-se com equipes médicas e pacientes via Teams',
      icon: <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
    },
    {
      id: 'meetings',
      title: 'Reuniões e Videoconferências',
      description: 'Consultas e reuniões virtuais via Teams',
      icon: <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    },
    {
      id: 'calendar',
      title: 'Calendário',
      description: 'Sincronize agendamentos e compromissos com Teams',
      icon: <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
    },
    {
      id: 'documents',
      title: 'Documentos e Arquivos',
      description: 'Acesse e compartilhe documentos médicos via Teams',
      icon: <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
    },
    {
      id: 'tasks',
      title: 'Tarefas e Listas',
      description: 'Gerencie tarefas da equipe médica via Teams',
      icon: <CheckSquare className="w-5 h-5 text-red-600 dark:text-red-400" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recursos a Integrar</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Selecione quais recursos do Microsoft Teams deseja integrar ao sistema hospitalar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuresList.map(feature => (
          <TeamsIntegrationSuggestion
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            isSelected={features[feature.id as keyof typeof features]}
            onToggle={() => toggleFeature(feature.id)}
          />
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
          Dica de Uso
        </h4>
        <p className="text-sm text-blue-500 dark:text-blue-300">
          A integração dos recursos selecionados estará disponível após salvar as configurações e poderá 
          levar alguns minutos para ser ativada. Você pode alterar estas configurações a qualquer momento.
        </p>
      </div>
    </div>
  );
};