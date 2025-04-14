/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react';
import { CognitivaAIPatientAssistant } from '@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant';
import { SettingsDashboard } from './components/SettingsDashboard';

const SettingsPage: React.FC = () => {
  return (
    <div className="px-4 -mt-16 mb-8">
      <SettingsDashboard />

      <CognitivaAIPatientAssistant />
    </div>
  );
};

export default SettingsPage;