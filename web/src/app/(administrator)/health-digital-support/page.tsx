/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';
import { DigitalAttendancePage } from './components/DigitalAttendancePage';

const HealthDigitalSupportPage: React.FC = () => {
  return (
    <div className="px-4 -mt-32">  
      <div className='bg-gradient-to-r from-blue-700 to-cyan-700 rounded-xl py-2'>       
        <DigitalAttendancePage />
      </div>    

      <MediMindAIAssistant />
    </div>
  );
};

export default HealthDigitalSupportPage;