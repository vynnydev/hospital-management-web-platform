/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { 
  Search, Bell, Users, Send, MessageSquare, Sparkles, 
  Building2, Info, Plus, Paperclip, X, UserPlus 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import type { NetworkData, Hospital } from '@/types/hospital-network-types';
import type { AppUser, Role } from '@/types/auth-types';

interface MessageCenterProps {
  networkData: NetworkData;
  currentUser: AppUser | null;
  loading: boolean;
}

export const MessageCenter: React.FC<MessageCenterProps> = ({ networkData, currentUser, loading }) => {
  const [selectedTab, setSelectedTab] = useState('announcements');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);

  const visibleHospitals = useMemo(() => {
    if (!networkData || !currentUser) return [];
    
    if (currentUser.role === 'Admin' || currentUser.permissions.includes('VIEW_ALL_HOSPITALS')) {
      return networkData.hospitals;
    }
    
    return networkData.hospitals.filter(h => h.id === currentUser.hospitalId);
  }, [networkData, currentUser]);

  const handleHospitalSelect = (hospitalId: string) => {
    if (selectedHospitals.includes(hospitalId)) {
      setSelectedHospitals(selectedHospitals.filter(id => id !== hospitalId));
    } else {
      setSelectedHospitals([hospitalId]);
    }
  };
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Mock AI suggestions
  const aiSuggestions = [
    {
      icon: "🏥",
      title: "Alta Ocupação",
      description: "Alerta: Hospital Itaim com ocupação crítica",
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

  const handleUserSelect = (user: AppUser) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setUserSearchQuery('');
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
      {/* Header com Tabs */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={currentUser?.profileImage || '/images/default-avatar.png'}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentUser?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{currentUser?.role}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {[
            { id: 'announcements', label: 'Avisos Gerais', icon: Bell },
            { id: 'messages', label: 'Mensagens', icon: MessageSquare },
            { id: 'ai-assist', label: 'Auxílio IA', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${selectedTab === tab.id
                  ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600/80 hover:to-cyan-600/80 hover:text-white'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Área de Seleção de Usuários */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm">
        <ScrollArea className="h-20">
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full"
              >
                <Image
                  src={user.profileImage || '/images/default-avatar.png'}
                  alt={user.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="relative">
              <div
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full cursor-pointer"
                onClick={() => setShowUserDropdown(true)}
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Adicionar</span>
              </div>
              
              {showUserDropdown && (
                <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Buscar usuários..."
                    className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-600"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Image
                          src={user.profileImage || '/images/default-avatar.png'}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Hospital Tags */}
      <div className="flex items-center gap-2 mb-4">
        {selectedHospitals.length === 0 ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Selecione um hospital para continuar
          </span>
        ) : (
          visibleHospitals
            .filter(h => selectedHospitals.includes(h.id))
            .map(hospital => (
              <div
                key={hospital.id}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                <Building2 className="w-4 h-4" />
                <span>{hospital.name}</span>
                <button
                  onClick={() => handleHospitalSelect(hospital.id)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
        )}
      </div>

      {/* Lista de Hospitais */}
      <ScrollArea className="h-64">
        <div className="grid grid-cols-3 gap-4">
          {visibleHospitals.map(hospital => (
            <Card
              key={hospital.id}
              onClick={() => handleHospitalSelect(hospital.id)}
              className={`cursor-pointer transition-all ${
                selectedHospitals.includes(hospital.id)
                  ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white'
                  : 'bg-white dark:bg-gray-700 hover:shadow-lg'
              } ${
                hospital.metrics.overall.occupancyRate > 85 
                  ? 'ring-2 ring-red-500' 
                  : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span className='text-xl'>{hospital.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{hospital.unit.city}, {hospital.unit.state}</p>
                  <div className="flex justify-between items-center">
                    <span>Ocupação:</span>
                    <span className={`font-medium ${
                      !selectedHospitals.includes(hospital.id) && (
                        hospital.metrics.overall.occupancyRate > 85
                          ? 'text-red-500'
                          : hospital.metrics.overall.occupancyRate > 70
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      )
                    }`}>
                      {hospital.metrics.overall.occupancyRate}%
                    </span>
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
      </ScrollArea>

      {/* Sugestões AI */}
      {selectedTab === 'ai-assist' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {aiSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion.description)}
              className={`p-4 rounded-xl bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-700 hover:to-cyan-700 
                hover:text-white transition-all group text-left`}
            >
              <div className="text-2xl mb-2">{suggestion.icon}</div>
              <h3 className="font-semibold mb-1">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-200">
                {suggestion.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Campo de Mensagem */}
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full p-4 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 resize-none h-32"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileAttach}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
            >
              <Paperclip className="w-5 h-5" />
              Anexar
            </button>
            {attachedFile && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                <span className="text-sm">{attachedFile.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <button
            disabled={!message.trim()}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all
              ${!message.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600'
              } text-white`}
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};