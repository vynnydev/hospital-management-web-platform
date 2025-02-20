// components/hospital/views/PredictionsView.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IHospitalPrediction } from '@/types/hospital-advanced-data-types';

interface IPredictionsViewProps {
  hospital: IHospital;
  predictions?: IHospitalPrediction;
}

export const PredictionsView: React.FC<IPredictionsViewProps> = ({ hospital, predictions }) => {
  if (!predictions) {
    return (
      <div className="p-3">
        <p className="text-gray-400">Dados preditivos não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <div>
        <h4 className="text-purple-300 text-sm font-medium mb-2">Previsão de Pacientes</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-700/50 p-2 rounded-md text-center">
            <p className="text-xs text-gray-300">24h</p>
            <p className="text-white font-medium">{predictions.expectedPatientInflow.next24h}</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md text-center">
            <p className="text-xs text-gray-300">48h</p>
            <p className="text-white font-medium">{predictions.expectedPatientInflow.next48h}</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md text-center">
            <p className="text-xs text-gray-300">7 dias</p>
            <p className="text-white font-medium">{predictions.expectedPatientInflow.next7d}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-blue-300 text-sm font-medium mb-2">Necessidade de Recursos</h4>
        <div className="space-y-2">
          <div className="bg-gray-700/50 p-2 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">UTI</span>
              <div className="flex items-center">
                <span className="text-white mr-2">{predictions.resourceNeeds.icu.current} → {predictions.resourceNeeds.icu.predicted}</span>
                {predictions.resourceNeeds.icu.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                {predictions.resourceNeeds.icu.trend === 'decreasing' && <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />}
                {predictions.resourceNeeds.icu.trend === 'stable' && <span className="h-px w-4 bg-blue-400 block" />}
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Emergência</span>
              <div className="flex items-center">
                <span className="text-white mr-2">{predictions.resourceNeeds.emergency.current} → {predictions.resourceNeeds.emergency.predicted}</span>
                {predictions.resourceNeeds.emergency.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                {predictions.resourceNeeds.emergency.trend === 'decreasing' && <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />}
                {predictions.resourceNeeds.emergency.trend === 'stable' && <span className="h-px w-4 bg-blue-400 block" />}
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Geral</span>
              <div className="flex items-center">
                <span className="text-white mr-2">{predictions.resourceNeeds.general.current} → {predictions.resourceNeeds.general.predicted}</span>
                {predictions.resourceNeeds.general.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-red-400" />}
                {predictions.resourceNeeds.general.trend === 'decreasing' && <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />}
                {predictions.resourceNeeds.general.trend === 'stable' && <span className="h-px w-4 bg-blue-400 block" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-yellow-300 text-sm font-medium mb-2">Fatores Sazonais</h4>
        <div className="space-y-2">
          {predictions.seasonalFactors.map((factor, index) => (
            <div key={index} className="bg-gray-700/50 p-2 rounded-md">
              <div className="flex justify-between">
                <span className="text-gray-200 capitalize">{factor.factor.replace('_', ' ')}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  factor.impact === 'high' ? 'bg-red-500/30 text-red-200' :
                  factor.impact === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                  'bg-green-500/30 text-green-200'
                }`}>
                  {factor.impact}
                </span>
              </div>
              <div className="mt-1 bg-gray-600/50 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-blue-400" 
                  style={{ width: `${factor.probability * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-400 mt-0.5">{Math.round(factor.probability * 100)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};