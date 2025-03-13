/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { MediMindAIPatientAssistant } from '@/components/ui/templates/medimind-ai-assistant/MediMindAIPatientAssistant';
import { DigitalAttendancePage } from './components/DigitalAttendancePage';

const HealthDigitalSupportPage: React.FC = () => {
  return (
    <div className="px-4 -mt-16">  
      <div className='bg-gradient-to-r from-blue-700 to-cyan-700 rounded-xl py-2'>       
        <DigitalAttendancePage />
      </div>    

      <MediMindAIPatientAssistant />
    </div>
  );
};

export default HealthDigitalSupportPage;