import React from 'react';
import { NextPage } from 'next';
import { DigitalCareContainer } from './DigitalCareContainer';

export const DigitalCareService: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className='py-12 px-8'>
            <h1 className="text-2xl font-bold text-white">
                Atendimento Digital de Saúde
            </h1>
        </div>
      
      <main className="max-w-8xl px-6">
        <DigitalCareContainer />
      </main>
    </div>
  );
};