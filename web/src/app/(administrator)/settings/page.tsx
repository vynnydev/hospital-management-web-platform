/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900 -mt-20 rounded-md">
      <div>Configurações</div>

      <MediMindAIAssistant />
    </div>
  );
};

export default SettingsPage;