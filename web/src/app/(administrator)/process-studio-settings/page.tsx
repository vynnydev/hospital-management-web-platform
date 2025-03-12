/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { MediMindAIPatientAssistant } from '@/components/ui/templates/medimind-ai-assistant/MediMindAIPatientAssistant';
import { SettingsDashboard } from './components/SettingsDashboard';

const SettingsPage: React.FC = () => {
  return (
    <div className="px-4 -mt-20 mb-8">
      <SettingsDashboard />

      <MediMindAIPatientAssistant />
    </div>
  );
};

export default SettingsPage;