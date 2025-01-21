/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import { Search, Bell, Users, Send, MessageSquare, Sparkles, Building2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import type { NetworkData, Hospital } from '@/types/hospital-network-types';
import type { AppUser, Role } from '@/types/auth-types';

interface MessageCenterProps {
  networkData: NetworkData;
  currentUser: AppUser | null
  loading: boolean;
}

interface AIMessage {
  title: string;
  description: string;
  type: 'attention' | 'suggestion' | 'maintenance' | 'alert';
  priority: 'high' | 'medium' | 'low';
}

// Helper functions para verificação de permissões
const checkUserAccess = (user: AppUser) => {
  const canManageNetwork = user.role === 'Admin';
  const canManageHospital = user.role === 'Hospital Manager';
  const canViewOnly = user.role === 'User';

  return {
    canSendMessages: canManageNetwork || canManageHospital,
    canUseAI: canManageNetwork || canManageHospital,
    canViewAllHospitals: user.permissions.includes('VIEW_ALL_HOSPITALS'),
    canViewHospital: (hospitalId: string) => {
      if (user.permissions.includes('VIEW_ALL_HOSPITALS')) return true;
      if (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId === hospitalId) return true;
      return false;
    }
  };
};

const MessageCenter: React.FC<MessageCenterProps> = ({ networkData, currentUser, loading }) => {
  const [selectedTab, setSelectedTab] = useState('announcements');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);
  const [message, setMessage] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

  if (!currentUser) return null

  // Obter permissões do usuário
  const {
    canSendMessages,
    canUseAI,
    canViewAllHospitals,
    canViewHospital
  } = checkUserAccess(currentUser);

  // Gera sugestões da IA baseadas nos dados da rede e permissões
  const generateAISuggestions = (): AIMessage[] => {
    const suggestions: AIMessage[] = [];
    const userHospitals = networkData.hospitals.filter(hospital => 
      canViewHospital(hospital.id)
    );

    userHospitals.forEach(hospital => {
      if (hospital.metrics.overall.occupancyRate > 85) {
        suggestions.push({
          title: "Alerta de Alta Ocupação",
          description: `${hospital.name} está com ocupação crítica de ${hospital.metrics.overall.occupancyRate}%`,
          type: "alert",
          priority: "high"
        });
      }

      // Adiciona mais sugestões específicas com base no role
      if (currentUser?.role === 'Hospital Manager' && hospital.id === currentUser?.hospitalId) {
        if (hospital.metrics.overall.turnoverRate < 0.5) {
          suggestions.push({
            title: "Gestão Operacional",
            description: `Oportunidade de melhoria na rotatividade de leitos em ${hospital.name}`,
            type: "suggestion",
            priority: "medium"
          });
        }
      }
    });

    // Sugestões específicas para Admin
    if (currentUser?.role === 'Admin') {
      const avgOccupancy = networkData.networkInfo.networkMetrics.averageOccupancy;
      if (avgOccupancy > 80) {
        suggestions.push({
          title: "Análise de Rede",
          description: "Alta ocupação média na rede. Considere estratégias de distribuição.",
          type: "maintenance",
          priority: "medium"
        });
      }
    }

    return suggestions;
  };

  const aiSuggestions = generateAISuggestions();

  const tabs = [
    {
      id: 'announcements',
      label: 'Avisos Gerais',
      icon: <Bell className="w-4 h-4" />,
      permitted: true
    },
    {
      id: 'messages',
      label: 'Mensagens',
      icon: <MessageSquare className="w-4 h-4" />,
      permitted: canSendMessages
    },
    {
      id: 'ai-assist',
      label: 'Auxílio IA',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      permitted: canUseAI
    }
  ].filter(tab => tab.permitted);

  useEffect(() => {
    if (networkData) {
      const filtered = networkData.hospitals
        .filter(hospital => canViewHospital(hospital.id))
        .filter(hospital => 
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.unit.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.unit.state.toLowerCase().includes(searchQuery.toLowerCase())
        );
      setFilteredHospitals(filtered);
    }
  }, [searchQuery, networkData, currentUser, canViewHospital]);

  const handleSendMessage = () => {
    if (!canSendMessages) return;
    
    // Verificar se o usuário pode enviar mensagem para os destinatários selecionados
    const validRecipients = selectedUsers.filter(user => {
      if (currentUser?.role === 'Admin') return true;
      if (currentUser?.role === 'Hospital Manager') {
        return user.hospitalId === currentUser?.hospitalId;
      }
      return false;
    });

    if (message.trim() && validRecipients.length > 0) {
      console.log('Mensagem enviada:', { 
        from: currentUser?.id,
        to: validRecipients.map(u => u.id),
        message, 
        timestamp: new Date().toISOString(),
        hospitalContext: currentUser?.hospitalId
      });
      setMessage('');
      setSelectedUsers([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg p-6 w-full max-w-8xl">
      {/* Cabeçalho com Informações do Usuário */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={currentUser?.profileImage || '/images/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
            
          />
          <div>
            <h2 className="text-2xl font-semibold">{currentUser?.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentUser?.role}
              {currentUser?.role === 'Hospital Manager' && currentUser?.hospitalId && (
                <span className="ml-2">| {networkData.hospitals.find(h => h.id === currentUser?.hospitalId)?.name}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all
                ${selectedTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white shadow-lg' 
                  : 'bg-gray-300 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Área Principal */}
      <div className="space-y-4">
        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar hospitais ou departamentos..."
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Cards dos Hospitais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredHospitals.map((hospital) => (
            <Card 
              key={hospital.id} 
              className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-none transform transition-all hover:scale-105 cursor-pointer
                ${hospital.metrics.overall.occupancyRate > 85 ? 'ring-2 ring-red-500' : ''}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {hospital.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600 dark:text-gray-300">
                    {hospital.unit.city}, {hospital.unit.state}
                  </p>
                  <div className="flex justify-between items-center">
                    <span>Ocupação:</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        hospital.metrics.overall.occupancyRate > 85 ? 'text-red-500' : 
                        hospital.metrics.overall.occupancyRate > 70 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        {hospital.metrics.overall.occupancyRate}%
                      </span>
                      {hospital.metrics.overall.occupancyRate > 85 && (
                        <Info className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="flex justify-between">
                    <span>Leitos:</span>
                    <span>{hospital.metrics.overall.totalBeds}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Área de Sugestões IA */}
        {selectedTab === 'ai-assist' && canUseAI && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSuggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-none
                  ${suggestion.priority === 'high' ? 'ring-2 ring-red-500' : ''}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    {suggestion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {suggestion.description}
                  </p>
                  <div className="mt-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Área de Mensagem */}
        {canSendMessages && (
          <div className="flex gap-2">
            <textarea
              className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600 px-4 rounded-md flex items-center gap-2 text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() || selectedUsers.length === 0}
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;