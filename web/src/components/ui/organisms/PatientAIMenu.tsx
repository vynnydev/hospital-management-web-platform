// AIMenus.tsx
import React from 'react';
import { Brain, ChevronDown, Clock, LineChart, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/organisms/dropdown-menu";
import { IAIFeature } from '@/types/ai-types';

// Menu de IA para Pacientes
export const PatientAIMenu = () => {
    const aiFeatures: IAIFeature[] = [
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
  
    return (
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
    );
  };