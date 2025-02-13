/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';

const HealthDigitalSupportPage: React.FC = () => {
  return (
    <div className="px-4 mb-8">
      <div>Atendimento digital de Saúde</div>

      <MediMindAIAssistant />
    </div>
  );
};

export default HealthDigitalSupportPage;