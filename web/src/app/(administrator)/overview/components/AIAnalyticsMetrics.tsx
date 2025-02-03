/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/organisms/tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAnalytics } from '@/services/hooks/analytics/useAnalytics';
import { AnalyticsSection } from './analytics/AnalyticsSection';
import { useHospitalAnalytics } from '@/services/hooks/AI/useHospitalAnalytics';
import { IAIAnalyticsProps, ISection } from '@/types/analytics-types';
import { analyticsSections } from './analytics/AI/analyticsSections';

const cleanText = (text: string) => {
  return text?.replace(/\*/g, '').trim() || "Dados não disponíveis";
};

const extractSection = (text: string, startMarker: string, endMarker: string): string => {
  if (!text) return "";
  
  try {
    const cleanStartMarker = startMarker.replace(/\*\*/g, '');
    const cleanEndMarker = endMarker ? endMarker.replace(/\*\*/g, '') : '';
    
    let startIndex = text.indexOf(cleanStartMarker);
    if (startIndex === -1) return "";
    
    startIndex = startIndex + cleanStartMarker.length;
    
    if (!cleanEndMarker) {
      return text.substring(startIndex).trim();
    }
    
    const endIndex = text.indexOf(cleanEndMarker, startIndex);
    if (endIndex === -1) {
      return text.substring(startIndex).trim();
    }
    
    return text.substring(startIndex, endIndex).trim();
  } catch (error) {
    console.error('Erro ao extrair seção:', error);
    return "";
  }
};

export const AIAnalyticsMetrics: React.FC<IAIAnalyticsProps> = ({ 
  }) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<boolean[]>(Array(4).fill(false));
  const { analyzeMetrics } = useHospitalAnalytics();
  const {
    loading: isLoading,
    error,
    analysis,
    fetchAnalysis,
    updateTimeoutRef
  } = useAnalytics(analyzeMetrics);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newExpandedSections = [...prev];
      newExpandedSections[index] = !newExpandedSections[index];
      return newExpandedSections;
    });
  };

  const processedSections = analyticsSections.map(section => {
    const processed: ISection = {
      ...section,
      content: '',
      subCards: section.subCards.map(card => ({
        ...card,
        content: cleanText(extractSection(analysis, card.extractionStart, card.extractionEnd))
      })),
      lines: section.lines.map(line => ({
        ...line,
        content: cleanText(extractSection(analysis, line.extractionStart, line.extractionEnd))
      })),
      actionPlan: cleanText(extractSection(analysis, section.actionPlanStart, section.actionPlanEnd))
    };
    
    return processed;
  });

  return (
    <TooltipProvider>
      <motion.div className="w-full">
        <div className="max-w-[1920px] mx-auto mt-4 bg-slate-100 dark:bg-slate-800 p-6 rounded-md">
          {processedSections.map((section, index) => (
            <AnalyticsSection
              key={index}
              {...section}
              isExpanded={expandedSections[index]}
              onToggle={() => toggleSection(index)}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};