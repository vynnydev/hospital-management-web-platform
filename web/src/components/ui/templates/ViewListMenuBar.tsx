import React, { useState } from 'react';
import { 
  LayoutGrid, 
  List, 
  Calendar, 
  Brain, 
  ChevronDown,
  Sparkles,
  LineChart,
  Clock,
  LucideIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/organisms/dropdown-menu"
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';
import { ConfigurationAndUserModalMenus } from '@/components/ui/templates/modals/ConfigurationAndUserModalMenus';

interface ViewMenuBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

type ViewType = 'board' | 'list' | 'calendar';

interface ViewOption {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

interface AIFeature {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const ViewListMenuBar: React.FC<ViewMenuBarProps> = ({ currentView, onViewChange }) => {
    const [defaultSection, setDefaultSection] = useState<string>('integrations');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const views: ViewOption[] = [
        { id: 'board', label: 'Board', icon: LayoutGrid },
        { id: 'list', label: 'Lista', icon: List },
        { id: 'calendar', label: 'Calendário', icon: Calendar },
    ];

    const aiFeatures: AIFeature[] = [
        { 
        label: 'Previsão de Alta', 
        icon: Clock,
        description: 'Estimar tempo de internação'
        },
        { 
        label: 'Análise de Risco', 
        icon: LineChart,
        description: 'Avaliar probabilidade de complicações'
        },
        { 
        label: 'Recomendações', 
        icon: Sparkles,
        description: 'Sugestões baseadas em casos similares'
        }
    ];

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setDefaultSection('integrations');
    };

    return (
        <div className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-900 dark:to-cyan-900 p-2 rounded-xl shadow-lg mb-6">
            <div className="flex items-center justify-between px-4">
                {/* AI Features Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all">
                        <Brain className="w-4 h-4" />
                        <span>IA Assistente</span>
                        <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl">
                        {aiFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <DropdownMenuItem
                            key={index}
                            className="flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                            >
                            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <div className="font-medium dark:text-white">{feature.label}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                {feature.description}
                                </div>
                            </div>
                            </DropdownMenuItem>
                        );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* View Options */}
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
                </div>

                <div className=''>
                    <IntegrationsPreviewPressable onSelectIntegration={handleOpenModal} hgt='8' wth='8' />

                    <ConfigurationAndUserModalMenus 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        defaultSection={defaultSection}
                        user={null}
                    />
                </div>
            </div>
        </div>
    );
};