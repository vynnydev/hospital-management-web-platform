// components/hospital/ViewModeSelector.tsx
import React from 'react';
import { Layers, Truck, Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { TViewMode } from '../HospitalsLocations';

interface IViewModeSelectorProps {
  viewMode: TViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<TViewMode>>;
}

export const ViewModeSelector: React.FC<IViewModeSelectorProps> = ({ viewMode, setViewMode }) => (
  <div className="absolute top-4 right-4 z-30 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2">
    <div className="flex flex-col space-y-2">
      <button 
        className={`p-2 rounded-md flex items-center ${viewMode === 'overview' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        onClick={() => setViewMode('overview')}
      >
        <Layers className="h-5 w-5 mr-2" />
        <span>Visão Geral</span>
      </button>
      
      <button 
        className={`p-2 rounded-md flex items-center ${viewMode === 'resources' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        onClick={() => setViewMode('resources')}
      >
        <Truck className="h-5 w-5 mr-2" />
        <span>Recursos</span>
      </button>
      
      <button 
        className={`p-2 rounded-md flex items-center ${viewMode === 'transfers' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        onClick={() => setViewMode('transfers')}
      >
        <Activity className="h-5 w-5 mr-2" />
        <span>Transferências</span>
      </button>
      
      <button 
        className={`p-2 rounded-md flex items-center ${viewMode === 'emergency' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        onClick={() => setViewMode('emergency')}
      >
        <AlertTriangle className="h-5 w-5 mr-2" />
        <span>Emergências</span>
      </button>
      
      <button 
        className={`p-2 rounded-md flex items-center ${viewMode === 'predictions' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        onClick={() => setViewMode('predictions')}
      >
        <TrendingUp className="h-5 w-5 mr-2" />
        <span>Previsões</span>
      </button>
      
      <button 
        className={`p-2 rounded-md flex items-center ${viewMode === 'staffing' ? 'bg-blue-500/40 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        onClick={() => setViewMode('staffing')}
      >
        <Zap className="h-5 w-5 mr-2" />
        <span>Equipes</span>
      </button>
    </div>
  </div>
);