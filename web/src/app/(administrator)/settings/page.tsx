/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';
import { SettingsDashboard } from './components/SettingsDashboard';

const SettingsPage: React.FC = () => {
  return (
    <div className="px-4 -mt-20 mb-8">
      <SettingsDashboard />

      <MediMindAIAssistant />
    </div>
  );
};

export default SettingsPage;