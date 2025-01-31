import React from 'react';
import type { IPatient } from '@/types/hospital-network-types';

interface RiskAnalysisProps {
  patient: IPatient;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ patient }) => {
  const getRiskScore = () => {
    return patient.careHistory?.events
      .filter(e => e.type === 'exam' && e.details?.examType === 'risk-assessment')
      .slice(-1)[0]?.details?.riskScore || 'N/A';
  };

  const getProcedures = () => {
    return patient.careHistory?.events
      .filter(event => event.type === 'procedure')
      .slice(0, 3); // Mostrar apenas os 3 procedimentos mais recentes
  };

  return (
    <div className="flex-1 max-w-[400px] space-y-4">
      {/* Análise de Risco */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-lg">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
          <span className="mr-2">📊</span> Análise de Risco
        </h4>
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 flex items-center">
            <span className="mr-2">📈</span> Score de Risco: {getRiskScore()}
          </p>
          <p className="text-gray-600 dark:text-gray-300 flex items-center">
            <span className="mr-2">🕰️</span> Permanência Prevista até: {
              patient.expectedDischarge 
                ? new Date(patient.expectedDischarge).toLocaleDateString() 
                : 'N/A'
            }
          </p>
        </div>
      </div>

      {/* Procedimentos */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
          Procedimentos Realizados
        </h4>
        <div className="space-y-2">
          {getProcedures()?.map((proc, index) => (
            <div 
              key={index}
              className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
            >
              <p className="font-medium text-gray-800 dark:text-white">
                {proc.details?.procedureType}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {proc.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Data: {new Date(proc.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};