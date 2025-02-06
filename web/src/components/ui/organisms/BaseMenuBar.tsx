// BaseMenuBar.tsx
import React from 'react';
import { LayoutGrid, List, Calendar, LucideIcon } from 'lucide-react';
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';
import { ConfigurationAndUserModalMenus } from '@/components/ui/templates/modals/ConfigurationAndUserModalMenus';

interface BaseMenuBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  LeftMenu?: React.ReactNode;  // Componente de menu à esquerda (IA)
  SearchComponent?: React.ReactNode;  // Componente de busca
}

export type ViewType = 'board' | 'list' | 'calendar';

const views: ViewOption[] = [
  { id: 'board', label: 'Board', icon: LayoutGrid },
  { id: 'list', label: 'Lista', icon: List },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
];

interface ViewOption {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

export const BaseMenuBar: React.FC<BaseMenuBarProps> = ({
  currentView,
  onViewChange,
  LeftMenu,
  SearchComponent
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-xl shadow-lg mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Menu Esquerdo (IA) */}
        <div className="flex items-center gap-4">
          {LeftMenu}
        </div>

        {/* View Options e Busca */}
        <div className="flex gap-2">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${currentView === view.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{view.label}</span>
              </button>
            );
          })}

          {SearchComponent}
        </div>

        <div>
          <IntegrationsPreviewPressable 
            onSelectIntegration={handleOpenModal} 
            hgt='8' 
            wth='8' 
          />

          <ConfigurationAndUserModalMenus 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            defaultSection="integrations"
            user={null}
          />
        </div>
      </div>
    </div>
  );
};