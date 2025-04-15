/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X, LogOut } from 'lucide-react';
import Image from 'next/image';
import { IAppUser } from '@/types/auth-types';

// Importação dos componentes de conteúdo
import { ProfileContent } from '../user-preferences/ProfileContent';
import { PreferencesContent } from '../user-preferences/PreferencesContent';
import { NotificationsContent } from '../user-preferences/NotificationsContent';
import { SecurityContent } from '../user-preferences/SecurityContent';
import { LayoutTheme } from '../user-preferences/LayoutTheme';
import { BrandingContent } from '../user-preferences/BrandingContent';
import { AccessibilitySettings } from '../user-preferences/AccessibilitySettings';
import { IntegrationsContent } from '../user-preferences/IntegrationsContent';
import { WorkflowAutomationContent } from '../WorkflowAutomationContent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: IAppUser | null;
  onLogout?: () => void;
  defaultSection?: string;
}

export const ConfigurationAndUserModalMenus: React.FC<Props> = ({ 
  isOpen, 
  onClose,
  user,
  onLogout,
  defaultSection = 'profile'
}) => {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [accessibilitySubSection, setAccessibilitySubSection] = useState<'visual' | 'alerts' | 'captions'>('visual');
  
  // Efeito para restaurar a posição de rolagem da barra lateral ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveSection(defaultSection), 300);
    }
  }, [isOpen, defaultSection]);

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
      title: 'APARÊNCIA',
      items: [
        { id: 'theme', label: 'Tema da Interface', icon: '🎨' },
        { id: 'layout', label: 'Layout & Exibição', icon: '📱' },
        { id: 'branding', label: 'Identidade Visual', icon: '✨' },
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

  // Renderiza o conteúdo com base na seção ativa
  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return <ProfileContent user={user} />;
      
      case 'preferences':
        return <PreferencesContent />;
        
      case 'notifications':
        return <NotificationsContent />;
        
      case 'security':
        return <SecurityContent />;
      
      case 'integrations':
        return <IntegrationsContent />;
      
      case 'theme':
        return <LayoutTheme />;
      
      case 'layout':
        return (
          <div className="space-y-8">
            <h3 className="text-lg font-medium mb-4">Layout & Exibição</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium">Funcionalidade em desenvolvimento</p>
              <p className="mt-1">As configurações de layout serão disponibilizadas em breve.</p>
            </div>
          </div>
        );
      
      case 'branding':
        return <BrandingContent />;
      
      case 'visual-settings':
        return <AccessibilitySettings section="visual" />;
        
      case 'notifications-settings':
        return <AccessibilitySettings section="alerts" />;
        
      case 'captions-settings':
        return <AccessibilitySettings section="captions" />;

      // Casos para seções ainda não implementadas
      case 'workflow':
        return <WorkflowAutomationContent />

      case 'ai-settings':
      case 'chat-settings':
      case 'teams':
      case 'departments':
      case 'permissions':
      case 'audit':
        return (
          <div className="space-y-8">
            <h3 className="text-lg font-medium mb-4">{getActiveMenuTitle()}</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium">Funcionalidade em desenvolvimento</p>
              <p className="mt-1">Esta seção será disponibilizada em breve.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            <LogOut className="w-5 h-5" />
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
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};