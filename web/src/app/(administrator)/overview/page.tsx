// pages/Overview.tsx
'use client'
import React from 'react';
import DashboardMetrics from './components/DashboardMetrics';
import AIAnaliticsMetrics from './components/AIAnaliticsMetrics'

import AgrixiAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';

import { useTheme } from 'next-themes'

const Overview: React.FC = () => {
  const { theme } = useTheme();

  const handleRefreshAnalysis = () => {
    // Lógica adicional se necessário
    console.log('Análise atualizada');
  };
  
  return (
    <div className="px-4 -mt-[100px]">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefreshAnalysis}
          className={`border-2 rounded-md p-2 border-cyan-600 bg-white/10 hover:bg-white/20 text-white dark:hover:bg-green-700 dark:text-green-100
            ${theme === 'dark'
                ? 'bg-[linear-gradient(135deg,#0F172A,#155E75)] shadow-[0_0_20px_rgba(15,23,42,0.5),0_0_40px_rgba(21,94,117,0.3)]'
                : 'bg-[linear-gradient(135deg,#BAE6FD,#99F6E4)] shadow-lg'
            }
        `}
        >
          Atualizar Análise
        </button>
      </div>

      <DashboardMetrics onRefresh={handleRefreshAnalysis} />

      <AIAnaliticsMetrics />

      <AgrixiAssistant />
    </div>
  );
};

export default Overview;