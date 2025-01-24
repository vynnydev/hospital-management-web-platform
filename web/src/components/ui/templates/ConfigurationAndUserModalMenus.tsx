/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { X, LogOut } from 'lucide-react';
import Image from 'next/image';
import { IntegrationsContent } from './modal-contents/IntegrationsContent';
import { AppUser } from '@/types/auth-types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  onLogout?: () => void;
  defaultSection?: string; // Nova prop
}

interface AccessibilityOptions {
  highContrast: boolean;
  visualAlerts: boolean;
  closedCaptions: boolean;
}

export const ConfigurationAndUserModalMenus: React.FC<Props> = ({ 
  isOpen, 
  onClose,
  user,
  onLogout,
  defaultSection = 'profile' // Define 'profile' como padrão
}) => {
  const [activeSection, setActiveSection] = useState(defaultSection);

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilityOptions>({
    highContrast: false,
    visualAlerts: true,
    closedCaptions: true
  });

  const menuSections = [
    {
      title: 'PERFIL & CONTA',
      items: [
        { id: 'profile', label: 'Meu Perfil', icon: '👤' },
        { id: 'preferences', label: 'Preferências', icon: '⚙️' },
        { id: 'notifications', label: 'Notificações', icon: '🔔' },
        { id: 'security', label: 'Segurança & Acesso', icon: '🔒' },
      ]
    },
    {
      title: 'GESTÃO HOSPITALAR',
      items: [
        { id: 'workflow', label: 'Fluxos & Automações', icon: '🔄' },
        { id: 'ai-settings', label: 'Configurações IA', icon: '🤖' },
        { id: 'chat-settings', label: 'Config. Chat Médico', icon: '💬' },
        { id: 'integrations', label: 'Integrações', icon: '🔗' },
      ]
    },
    {
      title: 'ADMINISTRAÇÃO',
      items: [
        { id: 'teams', label: 'Equipes Médicas', icon: '👥' },
        { id: 'departments', label: 'Departamentos', icon: '🏥' },
        { id: 'permissions', label: 'Permissões', icon: '🔑' },
        { id: 'audit', label: 'Auditoria', icon: '📋' },
      ]
    },
    {
      title: 'ACESSIBILIDADE',
      items: [
        { id: 'visual-settings', label: 'Configurações Visuais', icon: '👁️' },
        { id: 'notifications-settings', label: 'Alertas', icon: '⚡' },
        { id: 'captions-settings', label: 'Legendas', icon: '💬' },
      ]
    }
  ];

  const getActiveMenuTitle = () => {
    for (const section of menuSections) {
      const activeMenu = section.items.find(item => item.id === activeSection);
      if (activeMenu) return activeMenu.label;
    }
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
          {/* User Info */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5">
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src={user?.profileImage || '/images/default-avatar.png'}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{user?.name || 'Administrador'}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sua conta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu with Scroll */}
          <div className="overflow-y-auto flex-1 px-4 py-4">
            <div className="space-y-6">
              {menuSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left
                        ${activeSection === item.id 
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-7 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{getActiveMenuTitle()}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="max-w-[1000px] mx-auto">
              {activeSection === 'integrations' && <IntegrationsContent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};