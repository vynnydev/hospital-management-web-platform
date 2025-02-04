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
  Search,
  X,
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
import { Input } from "@/components/ui/organisms/input";

interface ViewMenuBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearch?: (query: string) => void;
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

export const ViewListMenuBar: React.FC<ViewMenuBarProps> = ({ 
  currentView, 
  onViewChange,
  onSearch 
}) => {
    const [defaultSection, setDefaultSection] = useState<string>('integrations');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => {
                const searchInput = document.getElementById('patient-search');
                searchInput?.focus();
            }, 100);
        } else {
            setSearchQuery('');
            onSearch?.('');
        }
    };

    return (
        <div className="relative">
            <div className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-xl shadow-lg mb-6">
                <div className="flex items-center justify-between gap-4">
                    {/* AI Features and Search Button */}
                    <div className="flex items-center gap-4">
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
                    </div>

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

                        {/* Search Toggle Button */}
                        <button
                            onClick={toggleSearch}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                                ${isSearchOpen 
                                    ? 'bg-white/20 text-white' 
                                    : 'text-white/70 hover:bg-white/10'}`}
                        >
                            {isSearchOpen ? (
                                <>
                                    <X className="w-4 h-4" />
                                    <span>Fechar busca</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    <span>Buscar paciente</span>
                                </>
                            )}
                        </button>
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
                            defaultSection={defaultSection}
                            user={null}
                        />
                    </div>
                </div>
            </div>

            {/* Animated Search Panel */}
            <div 
                className={`absolute left-0 right-0 transform transition-all duration-300 ease-in-out ${
                    isSearchOpen
                        ? 'translate-y-0 opacity-100 visible'
                        : '-translate-y-4 opacity-0 invisible'
                }`}
                style={{ 
                    top: 'calc(100% + 0.5rem)',
                    zIndex: 50
                }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mx-auto max-w-3xl">
                    <div className="relative py-2 px-3">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <Input
                            id="patient-search"
                            type="text"
                            placeholder="Digite o nome, ID ou diagnóstico do paciente..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full h-8 pl-8 pr-4 bg-transparent border-0 focus:ring-0 
                                     text-gray-900 dark:text-white placeholder-gray-500 
                                     dark:placeholder-gray-400 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};