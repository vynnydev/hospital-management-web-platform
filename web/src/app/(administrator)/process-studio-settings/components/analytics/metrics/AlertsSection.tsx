import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Users, 
  Shield, 
  Clock, 
  Activity,
  Pencil,
  Move,
  Save,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { INetworkData } from '@/types/hospital-network-types';
import { Input } from '@/components/ui/organisms/input';
import { Button } from '@/components/ui/organisms/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { IAlertCard } from '@/types/custom-metrics';

interface AlertsSectionProps {
  networkData: INetworkData | null;
  isEditing?: boolean;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ 
  networkData, 
  isEditing = false
}) => {
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedSubtitle, setEditedSubtitle] = useState<string>('');
  
  // Estado para armazenar os títulos e subtítulos personalizados
  const [customTitles, setCustomTitles] = useState<Record<number, { title: string; subtitle: string }>>({});
  
  // Simulando dados de alerta para demonstração
  const alertMetrics = {
    hospitalWithHighestOccupancy: networkData?.hospitals[0] || null,
    hospitalsBelowStaffingNorms: 1,
    equipmentMaintenanceAlerts: 2,
    emergencyRoomWaitingTime: 0
  };
  
  // Cartões de alerta principais
  const alertCards: IAlertCard[] = [
    {
      title: "Hospital Crítico",
      subtitle: "Maior Ocupação",
      icon: AlertTriangle,
      value: alertMetrics.hospitalWithHighestOccupancy?.name || "Hospital 4Health - Itaim",
      description: "Próximo ao limiar de alerta. Monitoramento recomendado.",
      gradient: "from-red-900/60 to-red-800/60",
      iconColor: "text-red-500",
      cardType: "hospital-critico",
      valueSize: "small",
      severity: "high",
      status: "Monitoramento Recomendado"
    },
    {
      title: "Déficit de Equipes",
      subtitle: "Dificuldade nas Equipes",
      icon: Users,
      value: alertMetrics.hospitalsBelowStaffingNorms,
      description: "Dentro dos parâmetros normais de operação.",
      gradient: "from-amber-900/60 to-amber-800/60",
      iconColor: "text-amber-500",
      cardType: "staff",
      severity: "medium",
      status: "Situação Normal"
    },
    {
      title: "Higienização de Equipamentos",
      subtitle: "Higienização Geral",
      icon: Shield,
      value: alertMetrics.equipmentMaintenanceAlerts,
      description: "Acima do limiar crítico. Requer atenção imediata.",
      gradient: "from-blue-900/60 to-blue-800/60",
      iconColor: "text-blue-500",
      cardType: "maintenance",
      severity: "high",
      status: "Requer Atenção Imediata"
    },
    {
      title: "Tempo de Espera",
      subtitle: "Espera",
      icon: Clock,
      value: alertMetrics.emergencyRoomWaitingTime,
      description: "Dentro dos parâmetros normais de operação.",
      gradient: "from-purple-900/60 to-purple-800/60",
      iconColor: "text-purple-500",
      cardType: "waiting",
      severity: "low",
      status: "Situação Normal"
    }
  ];
  
  // Função para iniciar a edição de um card
  const handleStartEditing = (index: number, title: string, subtitle: string) => {
    setEditingCardId(index);
    setEditedTitle(title);
    setEditedSubtitle(subtitle);
  };
  
  // Função para salvar a edição de um card
  const handleSaveEditing = () => {
    if (editingCardId !== null) {
      setCustomTitles(prev => ({
        ...prev,
        [editingCardId]: {
          title: editedTitle,
          subtitle: editedSubtitle
        }
      }));
      setEditingCardId(null);
    }
  };
  
  // Função para cancelar a edição
  const handleCancelEditing = () => {
    setEditingCardId(null);
  };
  
  // Função para obter o título e subtítulo de um card (personalizado ou padrão)
  const getCardTitleAndSubtitle = (index: number, defaultTitle: string, defaultSubtitle: string) => {
    if (customTitles[index]) {
      return {
        title: customTitles[index].title,
        subtitle: customTitles[index].subtitle
      };
    }
    return {
      title: defaultTitle,
      subtitle: defaultSubtitle
    };
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Alertas Principais
        </h2>
        
        {isEditing && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
                >
                  <Move className="h-4 w-4 mr-2" />
                  Edite o título e subtítulo
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                Clique no botão de edição para personalizar cada alerta
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertCards.map((alert, index) => {
          const IconComponent = alert.icon;
          const { title, subtitle } = getCardTitleAndSubtitle(index, alert.title, alert.subtitle);
          const isEditingThisCard = editingCardId === index;
          
          return (
            <Card 
              key={index}
              className={`relative overflow-hidden border-none bg-gradient-to-br ${alert.gradient}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${alert.iconColor} bg-opacity-20`}>
                      <IconComponent className={`h-5 w-5 ${alert.iconColor}`} />
                    </div>
                    {isEditingThisCard ? (
                      <Input 
                        className="ml-2 bg-gray-900/50 border-gray-700 text-white h-8"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                    ) : (
                      <h3 className="ml-2 font-medium text-gray-200">{title}</h3>
                    )}
                  </div>
                  
                  {/* Somente mostra o botão de edição quando isEditing=true e não está editando nenhum card */}
                  {isEditing && editingCardId === null && (
                    <div className="absolute top-2 right-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800/30"
                              onClick={() => handleStartEditing(index, title, subtitle)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                            Editar alerta
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  {isEditingThisCard ? (
                    <Input 
                      className="bg-gray-900/50 border-gray-700 text-gray-300 h-7 text-sm mb-2"
                      value={editedSubtitle}
                      onChange={(e) => setEditedSubtitle(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-400">{subtitle}</p>
                  )}
                  <div className={`text-2xl font-bold text-white ${alert.valueSize === 'small' ? 'text-lg' : ''}`}>
                    {alert.value}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-200">Análise comparativa</p>
                  <p className="text-xs text-gray-300 mt-1">{alert.description}</p>
                </div>
                
                <div className="mt-4">
                  <div className={`
                    px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center
                    ${alert.severity === 'high' ? 'bg-red-800/40 text-red-200' : 
                      alert.severity === 'medium' ? 'bg-amber-800/40 text-amber-200' : 
                      'bg-green-800/40 text-green-200'}
                  `}>
                    {alert.severity === 'high' ? 
                      <AlertTriangle className="h-3 w-3 mr-1" /> : 
                      alert.severity === 'medium' ? 
                        <AlertCircle className="h-3 w-3 mr-1" /> : 
                        <Activity className="h-3 w-3 mr-1" />
                    }
                    {alert.status}
                  </div>
                </div>
                
                {isEditingThisCard && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white h-7 px-2.5"
                      onClick={handleSaveEditing}
                    >
                      <Save className="h-3.5 w-3.5 mr-1" /> Salvar
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="bg-gray-900/30 border-gray-700 text-gray-300 hover:bg-gray-900/50 h-7 px-2.5"
                      onClick={handleCancelEditing}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};