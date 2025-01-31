import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Hospital } from 'lucide-react';
import type { IHospital } from '@/types/hospital-network-types';

interface HospitalSliderProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  onHospitalSelect: (hospitalId: string) => void;
}

export const HospitalNetworkListSlider: React.FC<HospitalSliderProps> = ({ 
  hospitals, 
  selectedHospital, 
  onHospitalSelect 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right'): void => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative p-8 w-full">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
      >
        <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>

      <div 
        ref={scrollRef}
        className="overflow-x-auto flex gap-4 scroll-smooth px-12 hide-scrollbar"
      >
        {hospitals.map((hospital) => {
          const isSelected = hospital.id === selectedHospital;
          
          return (
            <button
              key={hospital.id}
              onClick={() => onHospitalSelect(hospital.id)}
              className={`flex-shrink-0 w-full max-w-[450px] p-4 rounded-xl transition-all duration-300 
                       ${isSelected 
                         ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/50' 
                         : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <div className="flex flex-col items-start space-y-6 p-4">
                <div className='flex flex-row space-x-4'>
                  <div className={`p-2 rounded-lg ${isSelected 
                      ? 'bg-blue-100 dark:bg-blue-800/50' 
                      : 'bg-gray-200 dark:bg-gray-600/50'}`}
                  >
                    <Hospital className={`h-5 w-5 ${isSelected 
                        ? 'text-blue-500 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold ${isSelected
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'}`}>
                      {hospital.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hospital.unit.city}, {hospital.unit.state}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2 w-full">
                  <div className={`p-2 rounded-lg ${isSelected
                    ? 'bg-blue-100/50 dark:bg-blue-900/30'
                    : 'bg-gray-100 dark:bg-gray-600/30'}`}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Leitos</p>
                    <p className={`text-sm font-semibold ${isSelected
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'}`}>
                      {hospital.metrics?.overall?.totalBeds || 0}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${isSelected
                    ? 'bg-blue-100/50 dark:bg-blue-900/30'
                    : 'bg-gray-100 dark:bg-gray-600/30'}`}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ocupação</p>
                    <p className={`text-sm font-semibold ${isSelected
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'}`}>
                      {hospital.metrics?.overall?.occupancyRate?.toFixed(1) || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
      >
        <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};