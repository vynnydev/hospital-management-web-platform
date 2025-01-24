import React from 'react';
import Image from 'next/image';

interface IntegrationPreviewProps {
  onSelectIntegration: () => void;
}

interface Integration {
  imageUrl: string;
  color: string;
  alt: string;
}

const IntegrationButton = ({ imageUrl, color, alt, onClick }: Integration & { onClick: () => void }) => (
  <button onClick={onClick} className="relative group">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} overflow-hidden`}>
      <Image 
        src={imageUrl}
        alt={alt}
        width={52}
        height={52}
        className="object-contain"
      />
    </div>
    <div className="absolute -bottom-1 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-white text-xs flex items-center justify-center">+</span>
    </div>
  </button>
);

export const IntegrationsPreviewPressable: React.FC<IntegrationPreviewProps> = ({ onSelectIntegration }) => {
  const integrations: Integration[] = [
    {
        imageUrl: '/images/integrations/teams.png',
        color: 'bg-indigo-500',
        alt: 'Teams Integration'
    },
    {
      imageUrl: '/images/integrations/slack.png',
      color: 'bg-blue-500',
      alt: 'Slack Integration'
    },
    {
      imageUrl: '/images/integrations/gmail.png',
      color: 'bg-white',
      alt: 'Email Integration'
    },

    {
        imageUrl: '/images/integrations/whatsapp.png',
        color: 'bg-green-500',
        alt: 'Whatsapp Integration'
    },
    {
        imageUrl: '/images/integrations/plus.png',
        color: 'bg-white',
        alt: 'Mais integrações'
    },
  ];

  return (
    <div className="flex -space-x-2">
      {integrations.map((integration, index) => (
        <IntegrationButton
          key={index}
          {...integration}
          onClick={onSelectIntegration}
        />
      ))}
    </div>
  );
};