import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FileText, 
  Image as ImageIcon, 
  X 
} from 'lucide-react';
import type { IStaffTeam } from '@/types/staff-types';
import type { AIGeneratedContent } from '@/types/ai-types';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: IStaffTeam;
  content: AIGeneratedContent | null;
}

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  isOpen, 
  onClose, 
  team, 
  content 
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center 
        bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
          w-11/12 max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b 
          dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            IA Insights - {team.name}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 
              dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 p-4 flex items-center justify-center 
              ${activeTab === 'text' 
                ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <FileText className="mr-2" /> Recomendações
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 p-4 flex items-center justify-center 
              ${activeTab === 'image' 
                ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <ImageIcon className="mr-2" /> Imagem Gerada
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-auto flex-grow">
          {activeTab === 'text' ? (
            <div className="prose dark:prose-invert max-w-none">
              {content?.recommendation ? (
                <div 
                  className="prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ 
                    __html: content.recommendation.replace(/\n/g, '<br/>') 
                  }}
                />
              ) : (
                <p className="text-center text-gray-500">
                  Nenhuma recomendação gerada
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {content?.image ? (
                <Image 
                  src={content.image} 
                  alt="IA Generated Insight" 
                  className="max-w-full max-h-[600px] rounded-lg shadow-lg"
                  width={600}
                  height={600}
                />
              ) : (
                <p className="text-center text-gray-500">
                  Nenhuma imagem gerada
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};